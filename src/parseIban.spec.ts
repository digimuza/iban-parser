import { parseIBAN } from './parseIban'

describe('Parse iban', () => {
	test('Parsing and extracting iban information', () => {
		expect(parseIBAN('LT367300010140880365')).toEqual({
			bankCode: '73000',
			bic: 'HABALT22',
			city: 'Vilnius',
			control: '36',
			countyCode: 'LT',
			id: 73000,
			institutionName: 'Swedbank", AB',
		})
	})
})
