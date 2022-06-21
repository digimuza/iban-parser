import { z } from 'zod'
import { Jet, Parse } from '@digimuza/nscript'
import * as Ix from 'ix'
import { IBANInfo, PartialIBANInfo } from './src/types'
import * as P from 'ts-prime'
const countries = [
	{
		countyCode: 'LT',
		source: 'https://www.lb.lt/uploads/documents/files/LT-20220119-en.csv',
		schema: z
			.object({
				[`National ID`]: z.number(),
				[`BIC Code`]: z.string(),
				[`Financial Institution Name`]: z.string(),
				[`City`]: z.string(),
				[`Branch Address`]: z.string(),
			})
			.transform(
				(c): PartialIBANInfo => ({
					id: c['National ID'],
					bic: c['BIC Code'],
					institutionName: c['Financial Institution Name'],
					city: c.City,
				})
			),
	},
]

async function main() {
	const files = await Ix.AsyncIterable.from(countries)
		.flatMap((country) => {
			return Parse.download({
				url: country.source,
				downloadFolder: '/tmp',
			})
				.flatMap((e) => Parse.csvRead({ filePath: e }))
				.map((e) => {
					const res = country.schema.safeParse(e.data)
					if (res.success) return res.data
					// console.debug('Invalid iban row', e, res.error)
					return
				})
				.filter(P.isDefined)
				.map((x) => {
					return {
						...x,
						countyCode: country.countyCode,
					}
				})
		})
		.reduce((acc, c) => {
			if (c.id == null) return acc
			acc[c.id] = c
			return acc
		}, {} as Record<string, IBANInfo>)

	await Jet.writeAsync(Jet.path(__dirname, './src/dataset.json'), files)
}
main()
