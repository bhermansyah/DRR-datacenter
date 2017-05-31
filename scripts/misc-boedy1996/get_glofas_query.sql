-- Function: public.get_glofas_query(date, character varying, integer, character varying)

-- DROP FUNCTION public.get_glofas_query(date, character varying, integer, character varying);

CREATE OR REPLACE FUNCTION public.get_glofas_query(IN p_date date, IN p_filter character varying, IN p_code integer, IN p_spt_filter character varying)
  RETURNS TABLE(basin_id bigint, rl2 double precision, rl5 double precision, rl20 double precision, rl2_dis_percent integer, rl2_avg_dis_percent integer, rl5_dis_percent integer, rl5_avg_dis_percent integer, rl20_dis_percent integer, rl20_avg_dis_percent integer, rl100_pop double precision, rl100_area double precision, rl100_low_risk double precision, rl100_med_risk double precision, rl100_high_risk double precision) AS
$BODY$
  BEGIN
   IF p_filter='entireAfg' THEN
	   RETURN QUERY
		select 
		b.basin_id, b.rl2, b.rl5, b.rl20, b.rl2_dis_percent, b.rl2_avg_dis_percent, b.rl5_dis_percent, b.rl5_avg_dis_percent, b.rl20_dis_percent, b.rl20_avg_dis_percent,  
		sum(a.fldarea_population) as RL100_pop,
		sum(a.fldarea_sqm) as RL100_area,
		sum(case
		  when a.deeperthan = '029 cm' then a.fldarea_population
		  else 0	 
		end) as rl100_low_risk,
		sum(case
		  when a.deeperthan = '121 cm' then a.fldarea_population
		  else 0	 
		end) as rl100_med_risk,
		sum(case
		  when a.deeperthan = '271 cm' then a.fldarea_population
		  else 0	 
		end) as rl100_high_risk
		from afg_fldzonea_100k_risk_landcover_pop a
		inner join glofasintegrated b on b.basin_id = a.basin_id
		where b.datadate = p_date and b.rl2>1
		group by b.basin_id, b.rl2, b.rl5, b.rl20, b.rl2_dis_percent, b.rl2_avg_dis_percent, b.rl5_dis_percent, b.rl5_avg_dis_percent, b.rl20_dis_percent, b.rl20_avg_dis_percent
		order by b.basin_id, rl100_high_risk asc;
    ELSEIF p_filter='currentProvince' THEN
	IF length(p_code::text)>2 THEN
		RETURN QUERY
			select 
			b.basin_id, b.rl2, b.rl5, b.rl20, b.rl2_dis_percent, b.rl2_avg_dis_percent, b.rl5_dis_percent, b.rl5_avg_dis_percent, b.rl20_dis_percent, b.rl20_avg_dis_percent,  
			sum(a.fldarea_population) as RL100_pop,
			sum(a.fldarea_sqm) as RL100_area,
			sum(case
			  when a.deeperthan = '029 cm' then a.fldarea_population
			  else 0	 
			end) as rl100_low_risk,
			sum(case
			  when a.deeperthan = '121 cm' then a.fldarea_population
			  else 0	 
			end) as rl100_med_risk,
			sum(case
			  when a.deeperthan = '271 cm' then a.fldarea_population
			  else 0	 
			end) as rl100_high_risk
			from afg_fldzonea_100k_risk_landcover_pop a
			inner join glofasintegrated b on b.basin_id = a.basin_id
			where b.datadate = p_date AND a.dist_code = p_code and b.rl2>1
			group by b.basin_id, b.rl2, b.rl5, b.rl20, b.rl2_dis_percent, b.rl2_avg_dis_percent, b.rl5_dis_percent, b.rl5_avg_dis_percent, b.rl20_dis_percent, b.rl20_avg_dis_percent
			order by b.basin_id, rl100_high_risk asc;
	ELSE
		RETURN QUERY
			select 
			b.basin_id, b.rl2, b.rl5, b.rl20, b.rl2_dis_percent, b.rl2_avg_dis_percent, b.rl5_dis_percent, b.rl5_avg_dis_percent, b.rl20_dis_percent, b.rl20_avg_dis_percent,  
			sum(a.fldarea_population) as RL100_pop,
			sum(a.fldarea_sqm) as RL100_area,
			sum(case
			  when a.deeperthan = '029 cm' then a.fldarea_population
			  else 0	 
			end) as rl100_low_risk,
			sum(case
			  when a.deeperthan = '121 cm' then a.fldarea_population
			  else 0	 
			end) as rl100_med_risk,
			sum(case
			  when a.deeperthan = '271 cm' then a.fldarea_population
			  else 0	 
			end) as rl100_high_risk
			from afg_fldzonea_100k_risk_landcover_pop a
			inner join glofasintegrated b on b.basin_id = a.basin_id
			where b.datadate = p_date AND a.prov_code = p_code and b.rl2>1
			group by b.basin_id, b.rl2, b.rl5, b.rl20, b.rl2_dis_percent, b.rl2_avg_dis_percent, b.rl5_dis_percent, b.rl5_avg_dis_percent, b.rl20_dis_percent, b.rl20_avg_dis_percent
			order by b.basin_id, rl100_high_risk asc;
	END IF;
    ELSE
		RETURN QUERY
			select 
			b.basin_id, b.rl2, b.rl5, b.rl20, b.rl2_dis_percent, b.rl2_avg_dis_percent, b.rl5_dis_percent, b.rl5_avg_dis_percent, b.rl20_dis_percent, b.rl20_avg_dis_percent,  
			sum(a.fldarea_population) as RL100_pop,
			sum(a.fldarea_sqm) as RL100_area,
			sum(case
			  when a.deeperthan = '029 cm' then a.fldarea_population
			  else 0	 
			end) as rl100_low_risk,
			sum(case
			  when a.deeperthan = '121 cm' then a.fldarea_population
			  else 0	 
			end) as rl100_med_risk,
			sum(case
			  when a.deeperthan = '271 cm' then a.fldarea_population
			  else 0	 
			end) as rl100_high_risk
			from afg_fldzonea_100k_risk_landcover_pop a
			inner join glofasintegrated b on b.basin_id = a.basin_id
			where b.datadate = p_date AND ST_Within(a.wkb_geometry, ST_GeometryFromText(p_spt_filter, 4326)) and b.rl2>1
			group by b.basin_id, b.rl2, b.rl5, b.rl20, b.rl2_dis_percent, b.rl2_avg_dis_percent, b.rl5_dis_percent, b.rl5_avg_dis_percent, b.rl20_dis_percent, b.rl20_avg_dis_percent
			order by b.basin_id, rl100_high_risk asc;
    END IF;
 END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION public.get_glofas_query(date, character varying, integer, character varying)
  OWNER TO postgres;
