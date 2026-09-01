import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true // para que la cookie httpOnly del refresh token viaje
});

// --- almacenamiento del access token en memoria (NO localStorage) ---
let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

// --- request interceptor: agrega el access token en memoria ---
axiosInstance.interceptors.request.use((config) => {

    const tempToken = localStorage.getItem("temp_token");

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    } else if (tempToken) {
        config.headers.Authorization = `Bearer ${tempToken}`;
    }

    return config;
}, (error) => Promise.reject(error));

// 🔧 FIX (logout bug): callback opcional para avisar al resto de la app
// (AuthContext) cuando la sesión termina DE VERDAD, es decir, cuando un
// refresh disparado desde aquí (por un 401) falla de forma definitiva.
// Antes esto no existía: si el interceptor no conseguía refrescar, se
// limpiaba el access token en memoria pero AuthContext nunca se enteraba, así
// que `user` seguía "logueado" en la UI mientras todas las peticiones
// seguían fallando en segundo plano.
let onSessionExpired = null;

export const setOnSessionExpired = (callback) => {
    onSessionExpired = callback;
};

// 🔧 FIX (logout bug — causa raíz principal): refresco de sesión centralizado
// y deduplicado.
//
// Antes había DOS caminos totalmente independientes que podían llamar a
// POST /user/refresh al mismo tiempo con la MISMA cookie:
//   1. Este interceptor, cuando cualquier petición recibía un 401.
//   2. AuthContext.tryRestoreSession(), al montar la app y cada vez que la
//      pestaña volvía a estar visible (visibilitychange) — justo el
//      escenario de "salgo de la app y cuando vuelvo me ha sacado" que
//      describiste, porque es exactamente cuando el access token (dura solo
//      15 min) suele haber caducado.
//
// El backend rota el refresh token en cada uso (de un solo uso, por
// seguridad). Si estas dos peticiones llegaban casi a la vez con el mismo
// refresh token, ambas podían "ganar" en el servidor y pisarse entre sí
// (ver el fix en server/controller/user.js) — el resultado era que la cookie
// del navegador dejaba de coincidir con lo que el backend esperaba, y el
// siguiente refresh fallaba con "Invalid session" aunque el refresh token de
// 30 días siguiera siendo perfectamente válido. Eso te sacaba a /login sin
// ningún motivo real.
//
// La solución: una única función `refreshSession()`, compartida por el
// interceptor y por AuthContext. Si ya hay un refresh en curso, cualquier
// llamada adicional espera la MISMA promesa en vez de disparar una petición
// nueva — solo hay un POST /user/refresh en vuelo por pestaña en cada
// momento.
let refreshPromise = null;

export const refreshSession = () => {
    if (!refreshPromise) {
        refreshPromise = axiosInstance
            .post("/user/refresh")
            .then(({ data }) => {
                setAccessToken(data.accessToken);
                return data.accessToken;
            })
            .catch((error) => {
                setAccessToken(null);
                // la sesión ha terminado de verdad: avisamos a AuthContext
                if (onSessionExpired) onSessionExpired();
                throw error;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
};

// --- response interceptor: si el access token expiró (401), refresca y reintenta ---
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 🔧 FIX: guarda frente a error.config venir undefined (p. ej. errores
        // de red sin respuesta), que antes podía lanzar al leer originalRequest.url.
        const isAuthRoute = originalRequest?.url?.includes("/login")
            || originalRequest?.url?.includes("/refresh");

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRoute) {

            originalRequest._retry = true;

            try {
                // 🔧 FIX: antes cada petición 401 gestionaba su propio
                // isRefreshing/refreshQueue "a mano". Ahora simplemente se
                // apunta a la promesa compartida de refreshSession().
                const newAccessToken = await refreshSession();

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;