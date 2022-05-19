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
		{$group: 
			{
				_id: '$native_country',
				'Total credist of US citizen': {$sum: '$finance_info.total'}
			}
		},
		{$project: {_id: 0, 'Total credist of US citizen':1}}
	]
)/*5456803347*/
