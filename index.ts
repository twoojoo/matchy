export type Matchable = 
	| string
	| number
	| boolean
	| { [x: string]: Matchable }
	| Array<Matchable>;

export type Matcher<T> = (val: T) => boolean 

export function match<T extends Matchable, R = any>(val: T) {
	let matched = false
	let result: R
	let asyncCallback: (val: T) => R | Promise<R>

	function when(matcher: T | Matcher<T>) {
		return {
			do(callback: (val: T) => R | Promise<R>) {
				if (typeof matcher == "function" && matcher(val) || val === matcher) {
					matched = true
					if (isPromise(callback)) {
						asyncCallback = callback as (val: T) => Promise<R>
					} else {
						result = callback(val) as R
					}
				}

				return {
					when, 
					default(callback: (val: T) => R): R | Promise<R> {
						if (isPromise(callback)) {
							return new Promise(async r => {
								if (!matched) {
									result = await callback(val)
								}

								r(result)
							})
						} else {
							if (!matched) {
								result = callback(val)
							} else if (asyncCallback) {
								return new Promise(async r => {
									result = await asyncCallback(val)
									r(result)
								})
							}

							return result
						}
					}
				}
			}
		}
	}

	return {
		when,
		default(callback: (val: T) => R): R | Promise<R> {
			if (isPromise(callback)) {
				return new Promise(async r => {
					if (!matched) {
						result = await callback(val)
					}

					r(result)
				})
			} else {
				if (!matched) {
					result = callback(val)
				} else if (asyncCallback) {
					return new Promise(async r => {
						result = await asyncCallback(val)
						r(result)
					})
				}

				return result
			}
		}
	}
}

function isPromise<F extends (Function | Promise<any>)>(func: F) {
	if (
		typeof func === 'object' && 
		typeof func.then === 'function' && 
		typeof func.catch === 'function' && 
		typeof func.finally === 'function'
	) { return true }

	return false;
}


// ============== NUMBER MATHCERS ===========================

export function inRange<T extends number>(min: number, max: number): Matcher<T> {
	return function (val: T) {
		if (val < min) return false
		if (val > max) return false
		return true 
	}
}

export function gt<T extends number>(num: number): Matcher<T> {
	return function (val: T) {
		return val > num
	}
}

export function lt<T extends number>(num: number): Matcher<T> {
	return function (val: T) {
		return val < num
	}
}

export function gte<T extends number>(num: number): Matcher<T> {
	return function (val: T) {
		return val >= num
	}
}

export function lte<T extends number>(num: number): Matcher<T> {
	return function (val: T) {
		return val <= num
	}
}

export function isOdd<T extends number>(): Matcher<T> {
	return function (val: T) {
		return val % 2 == 1
	}
}

export function isEven<T extends number>(): Matcher<T> {
	return function (val: T) {
		return val % 2 == 0
	}
}


// ============== ARRAY MATHCERS ===========================

export function isEmpty<T extends any[]>(): Matcher<T> {
	return function (val: T) {
		return val.length == 0
	}
}

export function isRedundant<T extends any[]>(): Matcher<T> {
	return function (val: T) {
		const unique = new Set(val)
		return unique.size !== val.length
	}
}

export function contains<T extends any[]>(elem: T[number], fromPosition?: number | undefined): Matcher<T> {
	return function (val: T) {
		return val.includes(elem, fromPosition)
	}
}

export function elemAtIndex<T extends (any[] | string)>(index: number, value: T[number]): Matcher<T> {
	return function (val: T) {
		return val[index] === value
	}
}

// ============== STRING MATHCERS ===========================

export function hasLength<T extends (any[] | string)>(length: number): Matcher<T> {
	return function (val: T) {
		return val.length === length
	}
}

export function includes<T extends string>(subStr: T[number], fromPosition?: number | undefined): Matcher<T> {
	return function (val: T) {
		return val.includes(subStr, fromPosition)
	}
}

export function startsWith<T extends string>(start: string): Matcher<T> {
	return function (val: T) {
		return val.startsWith(start)
	}
}

export function endsWith<T extends string>(end: string): Matcher<T> {
	return function (val: T) {
		return val.endsWith(end)
	}
}

export function charAt<T extends string>(index: number, char: string): Matcher<T> {
	return function (val: T) {
		return val.charAt(index) == char
	}
}


// ============= OBJECT OPERATOR ==================

export function hasProperty<T>(key: string): Matcher<T> {
	return function (val: T) {
		return (val as any)[key] !== null && (val as any)[key] !== undefined
	}
}

export function property<T>(key: string) {
	return {
		is(value: any): Matcher<T> {
			return function (val: T) {
				return value === (val as any)[key]
			}
		},
		isNot(value: any): Matcher<T> {
			return function (val: T) {
				return value !== (val as any)[key]
			}
		}
	}
}

export function subProperty<T>(...keys: string[]) {
	return {
		is(value: any): Matcher<T> {
			return function (val: T) {
				let pointer: any = val

				for (let i = 0; i < keys.length; i++) {
					if (
						pointer[keys[i]] === null || 
						pointer[keys[i]] === undefined
					) break

					if (i == keys.length - 1 && value === pointer[keys[i]]) {
						return true
					}

					pointer = pointer[keys[i]]
				}

				return false
			}	
		},
		isNot(value: any): Matcher<T> {
			return function (val: T) {
				let pointer: any = val

				for (let i = 0; i < keys.length; i++) {
					if (
						pointer[keys[i]] === null || 
						pointer[keys[i]] === undefined
					) break

					if (i == keys.length - 1 && value === pointer[keys[i]]) {
						return false
					}

					pointer = pointer[keys[i]]
				}

				return true
			}	
		}
	}
}

export function hasSubProperty<T>(...keys: string[]): Matcher<T> {
	return function (val: T) {
		let pointer: any = val

		for (let i = 0; i < keys.length; i++) {
			if (
				pointer[keys[i]] === null || 
				pointer[keys[i]] === undefined
			) return false

			const key = keys[i]
			pointer = pointer[key]
		}

		return true
	}
}

// ======== operators ========================0

export function all<T>(...matchers: Matcher<T>[]): Matcher<T> {
	return function (val: T) {
		for (let i = 0; i < matchers.length; i++) {
			if (!matchers[i](val)) {
				return false
			}
		}

		return true
	}
}

export function some<T>(...matchers: Matcher<T>[]): Matcher<T> {
	return function (val: T) {
		for (let i = 0; i < matchers.length; i++) {
			if (!matchers[i](val)) {
				return true
			}
		}

		return false
	}
}

export function not<T>(matcher: Matcher<T>): Matcher<T> {
	return function (val: T) {
		return !matcher(val)
	}
}