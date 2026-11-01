import { hashToken } from "../utils/generateToken"

test('hasToken convierte "abc" en codigo SHA-256', () =>{
    const result = hashToken('abc');
    expect(result).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
});

test('hashtoken da siempre el mismo resultado para el mismo texto', () =>{
    expect(hashToken('hello')).toBe(hashToken('hello'))
});

test('hashToken da resultados distintos para textos distintos', () => {
    expect(hashToken('hello')).not.toBe(hashToken('bye'))
})