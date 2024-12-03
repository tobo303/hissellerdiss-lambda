import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import HissEllerDissMain from './HissEllerDissMain'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { makeHours, makeMinutes } from './scripts/time/makeTime';
import { BrowserRouter } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

//#region TanStack Query
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: makeMinutes(30),
			gcTime: makeHours(1),
		}
	}
});
//#endregion

createRoot(document.getElementById('root')!).render(
  	<StrictMode>
		<QueryClientProvider client={queryClient}>
      		<BrowserRouter>
        		<HissEllerDissMain />
      		</BrowserRouter>
			<ReactQueryDevtools />
		</QueryClientProvider>
	</StrictMode>
)
