import {
    useEffect,
    useState
} from "react"
import {
    countriesList
} from "../actions/auth";

export const useCountries = () => {
    const [countries, setCountries] = useState([]);
    const [loadCountries, setLoadCountries] = useState(false)

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            setLoadCountries(true);

            try {
                const data = await countriesList();

                const normalizedData = data
                    .filter(c => c.idd?.root)
                    .map(c => ({
                        name: c.name.common,
                        iso: c.cca2,
                        flag: c.flags?.svg,
                        phoneCodes: c.idd.suffixes.map(s => `${c.idd.root}${s}`)
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name))

                if (mounted) setCountries(normalizedData)
            } catch (error) {
                console.log(error)
            }finally{
                setLoadCountries(false)
            }
        }

        load();
        return () => (mounted = false)
    }, []);

    return {countries, loadCountries}
}