import dataSet from './dataset.json'

export function validIBAN(value: string) {
	let rearrange = value.substring(4, value.length) + value.substring(0, 4)
	let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
	let alphaMap: Record<string, number> = {}
	let number: string[] = []

	alphabet.forEach((value, index) => {
		alphaMap[value] = index + 10
	})

	rearrange.split('').forEach((value, index) => {
		number[index] = `${alphaMap[value] || value}`
	})

	return modulo(number.join('').toString(), 97) === 1
}

const modulo = (aNumStr: string, aDiv: number) => {
	var tmp = ''
	var i, r
	for (i = 0; i < aNumStr.length; i++) {
		tmp += aNumStr.charAt(i)
		r = parseInt(tmp) % aDiv
		tmp = r.toString()
	}
	return parseInt(tmp) / 1
}
// LT367300010140880365
export function parseIBAN(data: string) {
	if (!validIBAN(data)) return
	const dataS = dataSet as Record<string, typeof dataSet[keyof typeof dataSet]>
	const control = data.slice(2, 4)
	const bankCode = data.slice(4, 9)
	const knownValue = dataS[bankCode]
	if (knownValue == null) {
		return
	}

	const rest = data.slice(9)
	return {
		control,
		bankCode,
		...knownValue,
	}
}
