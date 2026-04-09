import { ClientComp } from './ClientComp.tsx'

export const ServerComp = () => {
	return (
		<div>
			ServerComps
			<ClientComp />
		</div>
	)
}
