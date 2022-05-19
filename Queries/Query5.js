db.user.aggregate
(
	[
		{$lookup:
			{
				from: 'finance',
				localField: 'finance_id',
				foreignField: '_id',
				as: 'finance_info'
			}
		},
		{$unwind: '$finance_info'},
		{$match: {'finance_info.total': {$gt: 100000}}},
		{$lookup:
			{
				from: 'occupation',
				localField: 'occupation_id',
				foreignField: '_id',
				as: 'occupation_info'
			}
		},
		{$unwind: '$occupation_info'},
		{$match: {'occupation_info.hours_per_week': {$lt: 55}}},
		{$count: 'total'}
	]
)/*24200*/