db.staging.aggregate
(
	[
		{$group: 
			{
				_id: 
				{
					total: '$total',
					income_bracket: '$income_bracket',
					capital_gain: '$capital_gain',
					capital_loss: '$capital_loss'
				}
			}
		},
		{$sort: {_id: -1}},
		{$project: 
			{
				_id:0, 
				total: '$_id.total', 
				income_bracket: '$_id.income_bracket',
				capital_gain: '$_id.capital_gain',
				capital_loss: '$_id.capital_loss'
			}
		},
		{$out: {db: 'asm2', coll: 'finance'}}
	]
)