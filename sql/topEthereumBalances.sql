select sum(value) as balance, address from (
	-- debits
	SELECT SUM(CONV(substring(`value`,3),16,10)) as value, `from` as address
		FROM `transaction`
		where `from` is not null
		GROUP BY `from`
	UNION ALL
	-- credits
	SELECT -SUM(CONV(substring(`value`,3),16,10)) as value, `to` as address
		FROM `transaction`
		where `to` is not null
		GROUP BY `to`
	UNION ALL
	-- transactions fees debits
	select sum(CONV(substring(`block`.gasUsed,3),16,10) * CONV(substring(`transaction`.gasPrice,3),16,10)) as value, `block`.miner as address
		from `transaction`
		join `block` on `block`.id = `transaction`.blockId
		group by `block`.miner
	UNION ALL
	-- transactions fees credits
    select -sum(CONV(substring(`transaction`.gas,3),16,10) * CONV(substring(`transaction`.gasPrice,3),16,10)) as value, `from` as address
		from `transaction`
		group by `from`
) as balances
group by address
order by balance desc
limit 10
