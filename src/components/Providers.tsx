'use client';

import { PropsWithChildren, useState } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc } from '@/app/_trpc/client';
import { TRPCClientError, httpBatchLink } from '@trpc/client';
import { useRouter } from 'next/navigation';
const Providers = ({ children }: PropsWithChildren) => {
	const router = useRouter();
	const [queryClient] = useState(new QueryClient({
		queryCache: new QueryCache({
		  onError: (err) => {
			console.log(err);
			
			if(err instanceof TRPCClientError && err.data?.code==='UNAUTHORIZED'){
				router.push('/sign-in')
			}
		}
		}),
	  }));
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					url: 'http://localhost:3000/api/trpc'
				})
			]
		})
	);
	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
};
export default Providers;
