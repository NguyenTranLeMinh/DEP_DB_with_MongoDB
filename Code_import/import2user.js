db.staging.aggregate
(
	[
		/*Lay ID tu relationship collection*/
		{$lookup: 
			{
				from: 'relationship',
				let: {
					var_marital_status: '$marital_status',
					var_relationship: '$relationship'
				},
				pipeline: [
					{
						$match: 
						{
							$expr: 
							{
								$and: 
								[
									{$eq: ['$$var_marital_status', '$marital_status']},
									{$eq: ['$$var_relationship', '$relationship']}
								]
							}
						}
					},
					{$project: {_id: 1}}
				],
				as: 'relationship_info'
			}
		},
		{$unwind: '$relationship_info'},
		
		
		/*Lay ID tu occupation collection*/
		{$lookup: 
			{
				from: 'occupation',
				let: {
					occupation_var: '$occupation',
					workclass_var: '$workclass',
					hours_per_week_var: '$hours_per_week'
				},
				pipeline: [
					{
						$match: 
						{
							$expr: 
							{
								$and: 
								[
									{$eq: ['$$occupation_var', '$occupation']},
									{$eq: ['$$workclass_var', '$workclass']},
									{$eq: ['$$hours_per_week_var', '$hours_per_week']}
								]
							}
						}
					},
					{$project: {_id: 1}}
				],
				as: 'occupation_info'
			}
		},
		{$unwind: '$occupation_info'},
		
		
		/*Lay ID tu finance collection*/
		{$lookup: 
			{
				from: 'finance',
				let: {
					total_var: '$total',
					income_bracket_var: '$income_bracket',
					capital_gain_var: '$capital_gain',
					capital_loss_var: '$capital_loss'
				},
				pipeline: [
					{
						$match: 
						{
							$expr: 
							{
								$and: 
								[
									{$eq: ['$$total_var', '$total']},
									{$eq: ['$$income_bracket_var', '$income_bracket']},
									{$eq: ['$$capital_gain_var', '$capital_gain']},
									{$eq: ['$$capital_loss_var', '$capital_loss']}
								]
							}
						}
					},
					{$project: {_id: 1}}
				],
				as: 'finance_info'
			}
		},
		{$unwind: '$finance_info'},
		
		{$project: 
			{
				_id: '$_id',
				age: '$age',
				race: '$race',
				gender: '$gender',
				native_country: '$native_country',
				education_id: '$education_num',
				relationship_id: '$relationship_info._id',
				occupation_id: '$occupation_info._id',
				finance_id: '$finance_info._id'
			}
		},
		{$out: {db: 'asm2', coll: 'user'}}
	]
)
