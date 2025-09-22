import { jsx as _jsx } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
export const QueryProvider = ({ children }) => {
    const [client] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                retry: 1
            }
        }
    }));
    return _jsx(QueryClientProvider, { client: client, children: children });
};
