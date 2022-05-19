db.user.aggregate
(
	[
		{$match: {native_country: ' United-States'}},
		{$lookup:
			{
				from: 'finance',
				localField: 'finance_id',
				foreignField: '_id',
				as: 'finance_info'
			}
		},
		{$unwind: '$finance_info'},
		{$match: {'finance_info.income_bracket': ' >50K'}},
		{$count: 'US citizen has income bracket over 50K'}
	]
)/*7171*/
