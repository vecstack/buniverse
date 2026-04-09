"use client"

import { useState } from 'react'

export const ClientComp = () => {
	const [count, setCount] = useState(0);
	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={() => setCount(count + 1)}>Increment</button>
	
		</div>
	)
}
