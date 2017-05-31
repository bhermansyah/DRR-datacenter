-- Function: public.get_glofas_detail(date)

-- DROP FUNCTION public.get_glofas_detail(date);

CREATE OR REPLACE FUNCTION public.get_glofas_detail(IN p_date date)
  RETURNS TABLE(prov_code integer, dist_code integer, basin_id bigint, rl2 double precision, rl5 double precision, rl20 double precision, rl2_dis_percent integer, rl2_avg_dis_percent integer, rl5_dis_percent integer, rl5_avg_dis_percent integer, rl20_dis_percent integer, rl20_avg_dis_percent integer, rl100_pop double precision, rl100_area double precision, rl100_low_risk double precision, rl100_med_risk double precision, rl100_high_risk double precision, extreme double precision, veryhigh double precision, high double precision, moderate double precision, low double precision, verylow double precision) AS
$BODY$
DECLARE var_r record;
DECLARE temp double precision;
DECLARE temp_rl20 double precision;   
DECLARE temp_dis_percent double precision;  

DECLARE constant_rl2  double precision;
DECLARE constant_rl5  double precision;
DECLARE constant_rl20  double precision;

BEGIN
   constant_rl2 := 0.02;
   constant_rl5 := 0.02;
   constant_rl20:= 0.18;
   
   FOR var_r IN(select 
		a.prov_code, a.dist_code, b.basin_id, b.rl2, b.rl5, b.rl20, b.rl2_dis_percent, b.rl2_avg_dis_percent, b.rl5_dis_percent, b.rl5_avg_dis_percent, b.rl20_dis_percent, b.rl20_avg_dis_percent,  
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
		group by a.prov_code, a.dist_code,b.basin_id, b.rl2, b.rl5, b.rl20, b.rl2_dis_percent, b.rl2_avg_dis_percent, b.rl5_dis_percent, b.rl5_avg_dis_percent, b.rl20_dis_percent, b.rl20_avg_dis_percent
		order by a.prov_code, a.dist_code,b.basin_id, rl100_high_risk asc)  
    LOOP
		prov_code := var_r.prov_code;
		dist_code := var_r.dist_code;
	        basin_id := var_r.basin_id; 
		rl2 := var_r.rl2;
		rl5 := var_r.rl5;
		rl20 := var_r.rl20;
		--rl2_dis_percent := var_r.rl2_dis_percent;
		rl2_dis_percent := 0;
		rl2_avg_dis_percent := var_r.rl2_avg_dis_percent;
		rl5_dis_percent := var_r.rl5_dis_percent;
		rl5_avg_dis_percent := var_r.rl5_avg_dis_percent;
		rl20_dis_percent := var_r.rl20_dis_percent;
		rl20_avg_dis_percent := var_r.rl20_avg_dis_percent;
		RL100_pop := var_r.RL100_pop;
		RL100_area := var_r.RL100_area/1000000;
		rl100_low_risk := var_r.rl100_low_risk;
		rl100_med_risk := var_r.rl100_med_risk;
		rl100_high_risk := var_r.rl100_high_risk;
		temp := var_r.RL100_pop;
		extreme := 0;
	        veryhigh := 0;
	        high := 0;
	        moderate := 0;
	        low := 0;
	        verylow := 0;

		temp_dis_percent := 0;
		IF rl2_dis_percent >= 100 THEN
			temp_dis_percent := rl2_avg_dis_percent;
		ELSE
			temp_dis_percent := rl2_dis_percent;
		END IF;	
		
		IF temp_dis_percent>400 THEN
			extreme := extreme + constant_rl2*temp;
			temp := temp - constant_rl2*temp;
		ELSEIF temp_dis_percent>160 AND temp_dis_percent<=400 THEN
			veryhigh := veryhigh + constant_rl2*temp;
			temp := temp - constant_rl2*temp;
		ELSEIF temp_dis_percent>120 AND temp_dis_percent<=160 THEN
			high := high + constant_rl2*temp;
			temp := temp - constant_rl2*temp;
		ELSEIF temp_dis_percent>90 AND temp_dis_percent<=120 THEN
			moderate := moderate + constant_rl2*temp;
			temp := temp - constant_rl2*temp;
		ELSEIF temp_dis_percent>70 AND temp_dis_percent<=90 THEN
			low := low + constant_rl2*temp;
			temp := temp - constant_rl2*temp;
		ELSEIF temp_dis_percent>25 AND temp_dis_percent<=50 THEN
			verylow := verylow + constant_rl2*temp;
			temp := temp - constant_rl2*temp;
		END IF;
		--temp := temp - extreme - veryhigh - high - moderate - low - verylow;

		temp_dis_percent := 0;
		IF rl5_dis_percent >= 100 THEN
			temp_dis_percent := rl5_avg_dis_percent;
		ELSE
			temp_dis_percent := rl5_dis_percent;
		END IF;	
		
		IF temp_dis_percent>160 THEN
			extreme := extreme + constant_rl5*temp;
			temp := temp - constant_rl5*temp;
		ELSEIF temp_dis_percent>120 AND temp_dis_percent<=160 THEN
			veryhigh := veryhigh + constant_rl5*temp;
			temp := temp - constant_rl5*temp;
		ELSEIF temp_dis_percent>90 AND temp_dis_percent<=120 THEN
			high := high + constant_rl5*temp;
			temp := temp - constant_rl5*temp;
		ELSEIF temp_dis_percent>70 AND temp_dis_percent<=90 THEN
			moderate := moderate + constant_rl5*temp;
			temp := temp - constant_rl5*temp;
		ELSEIF temp_dis_percent>50 AND temp_dis_percent<=70 THEN
			low := low + constant_rl5*temp;
			temp := temp - constant_rl5*temp;
		ELSEIF temp_dis_percent>25 AND temp_dis_percent<=50 THEN
			verylow := verylow + constant_rl5*temp;
			temp := temp - constant_rl5*temp;
		END IF;
		--temp := temp - extreme - veryhigh - high - moderate - low - verylow;

		temp_dis_percent := 0;
		IF rl20_dis_percent >= 100 THEN
			temp_dis_percent := rl20_avg_dis_percent;
		ELSE
			temp_dis_percent := rl20_dis_percent;
		END IF;	

		IF temp_dis_percent>125 THEN
			extreme := extreme + constant_rl20*temp;
			temp := temp - constant_rl20*temp;
		ELSEIF temp_dis_percent>100 AND temp_dis_percent<=125 THEN
			veryhigh := veryhigh + constant_rl20*temp;
			temp := temp - constant_rl20*temp;
		ELSEIF temp_dis_percent>75 AND temp_dis_percent<=100 THEN
			high := high + constant_rl20*temp;
			temp := temp - constant_rl20*temp;
		ELSEIF temp_dis_percent>50 AND temp_dis_percent<=75 THEN
			moderate := moderate + constant_rl20*temp;
			temp := temp - constant_rl20*temp;
		ELSEIF temp_dis_percent>25 AND temp_dis_percent<=50 THEN
			low := low + constant_rl20*temp;
			temp := temp - constant_rl20*temp;
		ELSEIF temp_dis_percent>0 AND temp_dis_percent<=25 THEN
			verylow := verylow + constant_rl20*temp;
			temp := temp - constant_rl20*temp;
		END IF;
		-- temp := temp - extreme - veryhigh - high - moderate - low - verylow;

		temp_rl20 := 0;
		IF temp_dis_percent>125 THEN
			temp_rl20 := temp_dis_percent - 100;
		END IF;
			
		IF temp_dis_percent>125 THEN
			veryhigh := veryhigh + (temp_rl20/100)*temp;
			temp := temp - ((temp_rl20/100)*temp);
		END IF;

        RETURN NEXT;
     END LOOP;
END; $BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION public.get_glofas_detail(date)
  OWNER TO postgres;
