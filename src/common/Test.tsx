"use client"

import { useState } from 'react'
import { updateAction } from './update';

export const Test = () => {
	const [count, setCount] = useState(0);
	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={() => setCount(count + 1)}>Increment</button>
			<button onClick={async () => {
				try {
					const newVal = await updateAction();
					setCount(newVal);
					
				} catch (error) {
					console.error("Error calling updateAction:", error);
				}
			}}>Decrement</button>
		</div>
	)
}
