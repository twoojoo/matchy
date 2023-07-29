import { all, charAt, contains, elemAtIndex, endsWith, gt, gte, hasLength, inRange, includes, isEmpty, isEven, isOdd, isRedundant, lt, lte, match, some, startsWith } from ".";

match(200)
	.when(gt(200)).do(_ => { throw Error("gt") })
	.default(_ => {})

match(200)
	.when(gt(199)).do(_ => {})
	.default(_ => { throw Error("gt") })

match(200)
	.when(lt(200)).do(_ => { throw Error("lt") })
	.default(_ => {})

match(200)
	.when(lt(201)).do(_ => {})
	.default(_ => { throw Error("lt") })

match(200)
	.when(lte(200)).do(_ => {})
	.default(_ => { throw Error("lte") })

match(200)
	.when(gte(200)).do(_ => {})
	.default(_ => { throw Error("gte") })


match(200)
	.when(inRange(200, 300)).do(_ => {})
	.default(_ => { throw Error("inRange") })

match(199)
	.when(inRange(200, 300)).do(_ => { throw Error("isOdd") })
	.default(_ => {})

match(3)
	.when(isOdd()).do(_ => {})
	.default(_ => { throw Error() })

match(4)
	.when(isEven()).do(_ => {})
	.default(_ => { throw Error("isEven") })



match([])
	.when(isEmpty()).do(_ => {})
	.default(_ => { throw Error("isEmpty") })

match([2, 2])
	.when(isRedundant()).do(_ => {})
	.default(_ => { throw Error("isRedundant") })

match([2, 1])
	.when(isRedundant()).do(_ => { throw Error("isRedundant") })
	.default(_ => {})

match([2, 1])
	.when(contains(1)).do(_ => {})
	.default(_ => { throw Error("contains") })

match([2, 1])
	.when(contains(3)).do(_ => { throw Error("contains") })
	.default(_ => {})

match([2, 1])
	.when(elemAtIndex(0, 2)).do(_ => {})
	.default(_ => { throw Error("elemAtIndex") })

match([2, 1])
	.when(elemAtIndex(0, 3)).do(_ => { throw Error("elemAtIndex") })
	.default(_ => {})


match("abc")
	.when(hasLength(3)).do(_ => {})
	.default(_ => { throw Error("hasLength") })

match("abc")
	.when(hasLength(4)).do(_ => { throw Error("hasLength") })
	.default(_ => {})

match("abc")
	.when(includes("b")).do(_ => {})
	.default(_ => { throw Error("includes") })

match("abc")
	.when(includes("d")).do(_ => { throw Error("includes") })
	.default(_ => {})

match("abc")
	.when(charAt(0, "a")).do(_ => {})
	.default(_ => { throw Error("charAt") })

match("abc")
	.when(endsWith("b")).do(_ => { throw Error("endsWith") })
	.default(_ => {})

match("abc")
	.when(endsWith("c")).do(_ => {})
	.default(_ => { throw Error("endsWith") })

match("abc")
	.when(startsWith("b")).do(_ => { throw Error("startsWith") })
	.default(_ => {})

match("abc")
	.when(startsWith("a")).do(_ => {})
	.default(_ => { throw Error("startsWith") })

match("abcdefg")
	.when(all(startsWith("a"), includes("defg"))).do(_ => {})
	.default(_ => { throw Error("all") })

match("abcdefg")
	.when(all(startsWith("a"), includes("defgh"))).do(_ => { throw Error("all") })
	.default(_ => {})

match("abcdefg")
	.when(some(
		startsWith("a"), 
		includes("defgh")
	)).do(_ => {})
	.default(_ => { throw Error("some") })

match("abcdefg")
	.when(some(
		startsWith("b"), 
		includes("defgh")
	)).do(_ => {})
	.default(_ => { throw Error("some") })