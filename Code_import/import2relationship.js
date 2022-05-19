db.staging.aggregate
(
	[
		{$group: 
			{
				_id: {marital_status: '$marital_status',
					  relationship: '$relationship'}
			}
		},
		{$sort: {_id: 1}},
		{$project: {_id:0, marital_status: '$_id.marital_status', relationship: '$_id.relationship'}} ,
		{$out: {db: 'asm2', coll: 'relationship'}}
	]
)