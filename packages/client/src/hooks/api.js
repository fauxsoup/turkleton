import debug from 'debug';
import { useEffect, useState } from 'react';
import axios from 'axios';

const log = debug('turkleton:hooks:api');

export function useAPI(urlOrOptions, deps) {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    let options = {};

    if (typeof urlOrOptions === 'string') {
        options = { ...options, url: urlOrOptions };
    } else {
        options = { ...options, ...urlOrOptions };
    }

    useEffect(function() {
        const request = axios(options);

        request.then(
            response => {
                log('useAPI(%o) : response : %o', options, response);
                setResult(response.data);
            },
            error => {
                log('useAPI(%o) : error : %o', options, error);
                setError(error);
            }
        );
    }, deps)

    return [error, result];
}
