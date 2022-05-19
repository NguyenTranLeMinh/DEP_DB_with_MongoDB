db.staging.aggregate
(
	[
		{$group: 
			{
				_id: {occupation:'$occupation', workclass: '$workclass', hours_per_week: '$hours_per_week'}
			}
		},
		{$sort: {_id: -1}},
		{$project: {_id:0, occupation: '$_id.occupation', workclass: '$_id.workclass', hours_per_week: '$_id.hours_per_week'}},
		{$out: {db: 'asm2', coll: 'occupation'}}
	]
)