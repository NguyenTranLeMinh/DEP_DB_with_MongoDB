db.user.aggregate
(
	[
		{$match: {gender: ' Female'}},
		{$lookup:
			{
				from: 'occupation',
				localField: 'occupation_id',
				foreignField: '_id',
				as: 'occupation_info'
			}
		},
		{$unwind: '$occupation_info'},
		{$match: {'occupation_info.hours_per_week': {$gt: 30}}},
		{$count: 'Women work over 30h per week'}	
	]
)/*8048*/
