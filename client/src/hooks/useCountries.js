import { useEffect, useState } from "react";
import { countriesList } from "../actions/auth";

export const useCountries = () => {
    const [countries, setCountries] = useState([]);
    const [loadCountries, setLoadCountries] = useState(false);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            setLoadCountries(true);

            try {
                const data = await countriesList();

                  const normalizedData = data
                    .map(country => ({
                        name: country.name,
                        iso: country.iso2,
                        flag: country.flag,
                        phoneCode: country?.phoneCode
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name));

                if (mounted) {
                    setCountries(normalizedData);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoadCountries(false);
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, []);

    return {
        countries,
        loadCountries
    };
};