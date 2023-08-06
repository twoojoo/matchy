import { Matcher, gt, match, some } from "./"

type User = {
	name: string
	age: number
	city: string
	student: boolean
}

const user1: User = {
	name: "John",
	age: 24,
	city: "London",
	student: false
}

//custom matcher
function isUnderage<T extends User>(): Matcher<T> {
	return function (val: T): boolean {
		return val.age < 18
	}
}

function isOver65<T extends User>(): Matcher<T> {
	return function (val: T): boolean {
		return val.age >= 65
	}
}

function isStudent<T extends User>(): Matcher<T> {
	return function (val: T): boolean {
		return val.student
	}
}

const ticketPrice = 
	match<number>(user1)
		.when(isUnderage()).do(_ => 10)
		.when(some(
			isOver65(), 
			isStudent()
		)).do(_ => 12)
		.default(_ => 20)

console.log("Ticket price:", ticketPrice)

