db.staging.aggregate
(
	[
		{$group: 
			{
				_id: '$education_num', 
				education: {$first: '$education'}
			}
		}, 
		{$sort: {_id:1}},
		{$out: {db: 'asm2', coll: 'education'}}
	]
)