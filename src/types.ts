import { z } from 'zod'
export const PartialIBANInfo = z.object({
	id: z.number(),
	bic: z.string(),
	institutionName: z.string(),
	city: z.string(),
})
export type PartialIBANInfo = z.TypeOf<typeof PartialIBANInfo>

export const IBANInfo = z
	.object({
		countyCode: z.string(),
	})
	.merge(PartialIBANInfo)
export type IBANInfo = z.TypeOf<typeof IBANInfo>
