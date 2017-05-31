-- Function: public.get_glofas(date, character varying, integer, character varying)

-- DROP FUNCTION public.get_glofas(date, character varying, integer, character varying);

CREATE OR REPLACE FUNCTION public.get_glofas(IN p_date date, IN p_filter character varying, IN p_code integer, IN p_spatial character varying)
  RETURNS TABLE(basin_id bigint, rl2 double precision, rl5 double precision, rl20 double precision, rl2_dis_percent integer, rl2_avg_dis_percent integer, rl5_dis_percent integer, rl5_avg_dis_percent integer, rl20_dis_percent integer, rl20_avg_dis_percent integer, rl100_pop double precision, rl100_area double precision, rl100_low_risk double precision, rl100_med_risk double precision, rl100_high_risk double precision, extreme double precision, veryhigh double precision, high double precision, moderate double precision, low double precision, verylow double precision, extreme_high double precision, extreme_med double precision, extreme_low double precision, veryhigh_high double precision, veryhigh_med double precision, veryhigh_low double precision, high_high double precision, high_med double precision, high_low double precision, moderate_high double precision, moderate_med double precision, moderate_low double precision, low_high double precision, low_med double precision, low_low double precision, verylow_high double precision, verylow_med double precision, verylow_low double precision, extreme_area double precision, veryhigh_area double precision, high_area double precision, moderate_area double precision, low_area double precision, verylow_area double precision) AS
$BODY$
DECLARE 
    var_r record;
DECLARE temp double precision;
DECLARE temp_area double precision;
DECLARE temp_rl20 double precision;   
DECLARE temp_dis_percent double precision;  
DECLARE temp_low_risk  double precision; 
DECLARE temp_med_risk  double precision;
DECLARE temp_high_risk  double precision;

DECLARE contant_rl2  double precision;
DECLARE contant_rl5  double precision;
DECLARE contant_rl20  double precision;
BEGIN
   constant_rl2 := 0.02;
   constant_rl5 := 0.05;
   constant_rl20:= 0.2;
   FOR var_r IN(select * from get_glofas_query(p_date,p_filter,p_code,p_spatial))  
     LOOP
        basin_id := var_r.basin_id; 
		rl2 := var_r.rl2;
		rl5 := var_r.rl5;
		rl20 := var_r.rl20;
		---rl2_dis_percent := var_r.rl2_dis_percent;
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
		temp_area := var_r.RL100_area/1000000;
		extreme := 0;
        veryhigh := 0;
        high := 0;
        moderate := 0;
        low := 0;
        verylow := 0;

        extreme_high := 0;
		extreme_med := 0;
		extreme_low := 0;
		veryhigh_high := 0;
		veryhigh_med := 0;
		veryhigh_low := 0;
		high_high := 0;
		high_med := 0;
		high_low := 0;
		moderate_high := 0;
		moderate_med := 0;
		moderate_low := 0;
		low_high := 0;
		low_med := 0;
		low_low := 0;
		verylow_high := 0;
		verylow_med := 0;
		verylow_low := 0;

		extreme_area := 0;
		veryhigh_area := 0;
		high_area := 0;
		moderate_area := 0;
		low_area := 0;
		verylow_area := 0;

        temp_low_risk := rl100_low_risk;
        temp_med_risk := rl100_med_risk;
        temp_high_risk := rl100_high_risk;

		temp_dis_percent := 0;
		IF rl2_dis_percent >= 100 THEN
			temp_dis_percent := rl2_avg_dis_percent;
		ELSE
			temp_dis_percent := rl2_dis_percent;
		END IF;	
		
		IF temp_dis_percent>400 THEN
			extreme := extreme + constant_rl2*temp;
			extreme_area := extreme_area + constant_rl2*temp_area;
			IF temp_high_risk-(constant_rl2*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl2*temp);
				extreme_high := extreme_high + (constant_rl2*temp);
			ELSEIF temp_high_risk-(constant_rl2*temp) < 0 AND temp_high_risk>0 THEN
				extreme_high := extreme_high + temp_high_risk;
				extreme_med := extreme_med + ((temp_high_risk-(constant_rl2*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl2*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl2*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl2*temp);
				extreme_med := extreme_med + (constant_rl2*temp);
			ELSEIF temp_med_risk-(constant_rl2*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				extreme_med:= extreme_med + temp_med_risk;
				extreme_low := extreme_low + ((temp_med_risk-(constant_rl2*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl2*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl2*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl2*temp);
				extreme_low := extreme_low + (constant_rl2*temp);
			END IF;
			temp := temp - constant_rl2*temp;
			temp_area := temp_area - constant_rl2*temp_area;
		ELSEIF temp_dis_percent>160 AND temp_dis_percent<=400 THEN
			veryhigh := veryhigh + constant_rl2*temp;
			veryhigh_area := veryhigh_area + constant_rl2*temp_area;
			IF temp_high_risk-(constant_rl2*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl2*temp);
				veryhigh_high := veryhigh_high + (constant_rl2*temp);
			ELSEIF temp_high_risk-(constant_rl2*temp) < 0 AND temp_high_risk>0 THEN
				veryhigh_high := veryhigh_high + temp_high_risk;
				veryhigh_med := veryhigh_med + ((temp_high_risk-(constant_rl2*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl2*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl2*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl2*temp);
				veryhigh_med := veryhigh_med + (constant_rl2*temp);
			ELSEIF temp_med_risk-(constant_rl2*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				veryhigh_med:= veryhigh_med + temp_med_risk;
				veryhigh_low := veryhigh_low + ((temp_med_risk-(constant_rl2*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl2*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl2*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl2*temp);
				veryhigh_low := veryhigh_low + (constant_rl2*temp);
			END IF;
			temp := temp - constant_rl2*temp;
			temp_area := temp_area - constant_rl2*temp_area;
		ELSEIF temp_dis_percent>120 AND temp_dis_percent<=160 THEN
			high := high + constant_rl2*temp;
			high_area := high_area + constant_rl2*temp_area;
			IF temp_high_risk-(constant_rl2*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl2*temp);
				high_high := high_high + (constant_rl2*temp);
			ELSEIF temp_high_risk-(constant_rl2*temp) < 0 AND temp_high_risk>0 THEN
				high_high := high_high + temp_high_risk;
				high_med := high_med + ((temp_high_risk-(constant_rl2*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl2*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl2*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl2*temp);
				high_med := high_med + (constant_rl2*temp);
			ELSEIF temp_med_risk-(constant_rl2*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				high_med:= high_med + temp_med_risk;
				high_low := high_low + ((temp_med_risk-(constant_rl2*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl2*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl2*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl2*temp);
				high_low := high_low + (constant_rl2*temp);
			END IF;
			temp := temp - constant_rl2*temp;
			temp_area := temp_area - constant_rl2*temp_area;
		ELSEIF temp_dis_percent>90 AND temp_dis_percent<=120 THEN
			moderate := moderate + constant_rl2*temp;
			moderate_area := moderate_area + constant_rl2*temp_area;
			IF temp_high_risk-(constant_rl2*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl2*temp);
				moderate_high := moderate_high + (constant_rl2*temp);
			ELSEIF temp_high_risk-(constant_rl2*temp) < 0 AND temp_high_risk>0 THEN
				moderate_high := moderate_high + temp_high_risk;
				moderate_med := moderate_med + ((temp_high_risk-(constant_rl2*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl2*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl2*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl2*temp);
				moderate_med := moderate_med + (constant_rl2*temp);
			ELSEIF temp_med_risk-(constant_rl2*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				moderate_med:= moderate_med + temp_med_risk;
				moderate_low := moderate_low + ((temp_med_risk-(constant_rl2*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl2*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl2*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl2*temp);
				moderate_low := moderate_low + (constant_rl2*temp);
			END IF;
			temp := temp - constant_rl2*temp;
			temp_area := temp_area - constant_rl2*temp_area;
		ELSEIF temp_dis_percent>70 AND temp_dis_percent<=90 THEN
			low := low + constant_rl2*temp;
			low_area := low_area + constant_rl2*temp_area;
			IF temp_high_risk-(constant_rl2*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl2*temp);
				low_high := low_high + (constant_rl2*temp);
			ELSEIF temp_high_risk-(constant_rl2*temp) < 0 AND temp_high_risk>0 THEN
				low_high := low_high + temp_high_risk;
				low_med := low_med + ((temp_high_risk-(constant_rl2*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl2*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl2*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl2*temp);
				low_med := low_med + (constant_rl2*temp);
			ELSEIF temp_med_risk-(constant_rl2*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				low_med:= low_med + temp_med_risk;
				low_low := low_low + ((temp_med_risk-(constant_rl2*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl2*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl2*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl2*temp);
				low_low := low_low + (constant_rl2*temp);
			END IF;
			temp := temp - constant_rl2*temp;
			temp_area := temp_area - constant_rl2*temp_area;
		ELSEIF temp_dis_percent>25 AND temp_dis_percent<=50 THEN
			verylow := verylow + constant_rl2*temp;
			verylow_area := verylow_area + constant_rl2*temp_area;
			IF temp_high_risk-(constant_rl2*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl2*temp);
				verylow_high := verylow_high + (constant_rl2*temp);
			ELSEIF temp_high_risk-(constant_rl2*temp) < 0 AND temp_high_risk>0 THEN
				verylow_high := verylow_high + temp_high_risk;
				verylow_med := verylow_med + ((temp_high_risk-(constant_rl2*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl2*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl2*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl2*temp);
				verylow_med := verylow_med + (constant_rl2*temp);
			ELSEIF temp_med_risk-(constant_rl2*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				verylow_med:= verylow_med + temp_med_risk;
				verylow_low := verylow_low + ((temp_med_risk-(constant_rl2*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl2*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl2*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl2*temp);
				verylow_low := verylow_low + (constant_rl2*temp);
			END IF;
			temp := temp - constant_rl2*temp;
			temp_area := temp_area - constant_rl2*temp_area;
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
			extreme_area := extreme_area + constant_rl5*temp_area;
			IF temp_high_risk-(constant_rl5*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl5*temp);
				extreme_high := extreme_high + (constant_rl5*temp);
			ELSEIF temp_high_risk-(constant_rl5*temp) < 0 AND temp_high_risk>0 THEN
				extreme_high := extreme_high + temp_high_risk;
				extreme_med := extreme_med + ((temp_high_risk-(constant_rl5*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl5*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl5*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl5*temp);
				extreme_med := extreme_med + (constant_rl5*temp);
			ELSEIF temp_med_risk-(constant_rl5*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				extreme_med:= extreme_med + temp_med_risk;
				extreme_low := extreme_low + ((temp_med_risk-(constant_rl5*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl5*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl5*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl5*temp);
				extreme_low := extreme_low + (constant_rl5*temp);
			END IF;
			temp := temp - constant_rl5*temp;
			temp_area := temp_area - constant_rl5*temp_area;
		ELSEIF temp_dis_percent>120 AND temp_dis_percent<=160 THEN
			veryhigh := veryhigh + constant_rl5*temp;
			veryhigh_area := veryhigh_area + constant_rl5*temp_area;
			IF temp_high_risk-(constant_rl5*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl5*temp);
				veryhigh_high := veryhigh_high + (constant_rl5*temp);
			ELSEIF temp_high_risk-(constant_rl5*temp) < 0 AND temp_high_risk>0 THEN
				veryhigh_high := veryhigh_high + temp_high_risk;
				veryhigh_med := veryhigh_med + ((temp_high_risk-(constant_rl5*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl5*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl5*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl5*temp);
				veryhigh_med := veryhigh_med + (constant_rl5*temp);
			ELSEIF temp_med_risk-(constant_rl5*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				veryhigh_med:= veryhigh_med + temp_med_risk;
				veryhigh_low := veryhigh_low + ((temp_med_risk-(constant_rl5*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl5*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl5*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl5*temp);
				veryhigh_low := veryhigh_low + (constant_rl5*temp);
			END IF;
			temp := temp - constant_rl5*temp;
			temp_area := temp_area - constant_rl5*temp_area;
		ELSEIF temp_dis_percent>90 AND temp_dis_percent<=120 THEN
			high := high + constant_rl5*temp;
			high_area := high_area + constant_rl5*temp_area;
			IF temp_high_risk-(constant_rl5*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl5*temp);
				high_high := high_high + (constant_rl5*temp);
			ELSEIF temp_high_risk-(constant_rl5*temp) < 0 AND temp_high_risk>0 THEN
				high_high := high_high + temp_high_risk;
				high_med := high_med + ((temp_high_risk-(constant_rl5*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl5*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl5*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl5*temp);
				high_med := high_med + (constant_rl5*temp);
			ELSEIF temp_med_risk-(constant_rl5*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				high_med:= high_med + temp_med_risk;
				high_low := high_low + ((temp_med_risk-(constant_rl5*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl5*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl5*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl5*temp);
				high_low := high_low + (constant_rl5*temp);
			END IF;
			temp := temp - constant_rl5*temp;
			temp_area := temp_area - constant_rl5*temp_area;
		ELSEIF temp_dis_percent>70 AND temp_dis_percent<=90 THEN
			moderate := moderate + constant_rl5*temp;
			moderate_area := moderate_area + constant_rl5*temp_area;
			IF temp_high_risk-(constant_rl5*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl5*temp);
				moderate_high := moderate_high + (constant_rl5*temp);
			ELSEIF temp_high_risk-(constant_rl5*temp) < 0 AND temp_high_risk>0 THEN
				moderate_high := moderate_high + temp_high_risk;
				moderate_med := moderate_med + ((temp_high_risk-(constant_rl5*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl5*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl5*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl5*temp);
				moderate_med := moderate_med + (constant_rl5*temp);
			ELSEIF temp_med_risk-(constant_rl5*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				moderate_med:= moderate_med + temp_med_risk;
				moderate_low := moderate_low + ((temp_med_risk-(constant_rl5*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl5*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl5*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl5*temp);
				moderate_low := moderate_low + (constant_rl5*temp);
			END IF;
			temp := temp - constant_rl5*temp;
			temp_area := temp_area - constant_rl5*temp_area;
		ELSEIF temp_dis_percent>50 AND temp_dis_percent<=70 THEN
			low := low + constant_rl5*temp;
			low_area := low_area + constant_rl5*temp_area;
			IF temp_high_risk-(constant_rl5*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl5*temp);
				low_high := low_high + (constant_rl5*temp);
			ELSEIF temp_high_risk-(constant_rl5*temp) < 0 AND temp_high_risk>0 THEN
				low_high := low_high + temp_high_risk;
				low_med := low_med + ((temp_high_risk-(constant_rl5*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl5*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl5*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl5*temp);
				low_med := low_med + (constant_rl5*temp);
			ELSEIF temp_med_risk-(constant_rl5*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				low_med:= low_med + temp_med_risk;
				low_low := low_low + ((temp_med_risk-(constant_rl5*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl5*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl5*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl5*temp);
				low_low := low_low + (constant_rl5*temp);
			END IF;
			temp := temp - constant_rl5*temp;
			temp_area := temp_area - constant_rl5*temp_area;
		ELSEIF temp_dis_percent>25 AND temp_dis_percent<=50 THEN
			verylow := verylow + constant_rl5*temp;
			verylow_area := verylow_area + constant_rl5*temp_area;
			IF temp_high_risk-(constant_rl5*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl5*temp);
				verylow_high := verylow_high + (constant_rl5*temp);
			ELSEIF temp_high_risk-(constant_rl5*temp) < 0 AND temp_high_risk>0 THEN
				verylow_high := verylow_high + temp_high_risk;
				verylow_med := verylow_med + ((temp_high_risk-(constant_rl5*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl5*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl5*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl5*temp);
				verylow_med := verylow_med + (constant_rl5*temp);
			ELSEIF temp_med_risk-(constant_rl5*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				verylow_med:= verylow_med + temp_med_risk;
				verylow_low := verylow_low + ((temp_med_risk-(constant_rl5*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl5*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl5*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl5*temp);
				verylow_low := verylow_low + (constant_rl5*temp);
			END IF;
			temp := temp - constant_rl5*temp;
			temp_area := temp_area - constant_rl5*temp_area;
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
			extreme_area := extreme_area + constant_rl20*temp_area;
			IF temp_high_risk-(constant_rl20*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl20*temp);
				extreme_high := extreme_high + (constant_rl20*temp);
			ELSEIF temp_high_risk-(constant_rl20*temp) < 0 AND temp_high_risk>0 THEN
				extreme_high := extreme_high + temp_high_risk;
				extreme_med := extreme_med + ((temp_high_risk-(constant_rl20*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl20*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl20*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl20*temp);
				extreme_med := extreme_med + (constant_rl20*temp);
			ELSEIF temp_med_risk-(constant_rl20*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				extreme_med:= extreme_med + temp_med_risk;
				extreme_low := extreme_low + ((temp_med_risk-(constant_rl20*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl20*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl20*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl20*temp);
				extreme_low := extreme_low + (constant_rl20*temp);
			END IF;
			temp := temp - constant_rl20*temp;
			temp_area := temp_area - constant_rl20*temp_area;
		ELSEIF temp_dis_percent>100 AND temp_dis_percent<=125 THEN
			veryhigh := veryhigh + constant_rl20*temp;
			veryhigh_area := veryhigh_area + constant_rl20*temp_area;
			IF temp_high_risk-(constant_rl20*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl20*temp);
				veryhigh_high := veryhigh_high + (constant_rl20*temp);
			ELSEIF temp_high_risk-(constant_rl20*temp) < 0 AND temp_high_risk>0 THEN
				veryhigh_high := veryhigh_high + temp_high_risk;
				veryhigh_med := veryhigh_med + ((temp_high_risk-(constant_rl20*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl20*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl20*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl20*temp);
				veryhigh_med := veryhigh_med + (constant_rl20*temp);
			ELSEIF temp_med_risk-(constant_rl20*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				veryhigh_med:= veryhigh_med + temp_med_risk;
				veryhigh_low := veryhigh_low + ((temp_med_risk-(constant_rl20*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl20*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl20*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl20*temp);
				veryhigh_low := veryhigh_low + (constant_rl20*temp);
			END IF;
			temp := temp - constant_rl20*temp;
			temp_area := temp_area - constant_rl20*temp_area;
		ELSEIF temp_dis_percent>75 AND temp_dis_percent<=100 THEN
			high := high + constant_rl20*temp;
			high_area := high_area + constant_rl20*temp_area;
			IF temp_high_risk-(constant_rl20*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl20*temp);
				high_high := high_high + (constant_rl20*temp);
			ELSEIF temp_high_risk-(constant_rl20*temp) < 0 AND temp_high_risk>0 THEN
				high_high := high_high + temp_high_risk;
				high_med := high_med + ((temp_high_risk-(constant_rl20*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl20*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl20*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl20*temp);
				high_med := high_med + (constant_rl20*temp);
			ELSEIF temp_med_risk-(constant_rl20*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				high_med:= high_med + temp_med_risk;
				high_low := high_low + ((temp_med_risk-(constant_rl20*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl20*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl20*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl20*temp);
				high_low := high_low + (constant_rl20*temp);
			END IF;
			temp := temp - constant_rl20*temp;
			temp_area := temp_area - constant_rl20*temp_area;
		ELSEIF temp_dis_percent>50 AND temp_dis_percent<=75 THEN
			moderate := moderate + constant_rl20*temp;
			moderate_area := moderate_area + constant_rl20*temp_area;
			IF temp_high_risk-(constant_rl20*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl20*temp);
				moderate_high := moderate_high + (constant_rl20*temp);
			ELSEIF temp_high_risk-(constant_rl20*temp) < 0 AND temp_high_risk>0 THEN
				moderate_high := moderate_high + temp_high_risk;
				moderate_med := moderate_med + ((temp_high_risk-(constant_rl20*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl20*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl20*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl20*temp);
				moderate_med := moderate_med + (constant_rl20*temp);
			ELSEIF temp_med_risk-(constant_rl20*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				moderate_med:= moderate_med + temp_med_risk;
				moderate_low := moderate_low + ((temp_med_risk-(constant_rl20*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl20*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl20*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl20*temp);
				moderate_low := moderate_low + (constant_rl20*temp);
			END IF;
			temp := temp - constant_rl20*temp;
			temp_area := temp_area - constant_rl20*temp_area;
		ELSEIF temp_dis_percent>25 AND temp_dis_percent<=50 THEN
			low := low + constant_rl20*temp;
			low_area := low_area + constant_rl20*temp_area;
			IF temp_high_risk-(constant_rl20*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl20*temp);
				low_high := low_high + (constant_rl20*temp);
			ELSEIF temp_high_risk-(constant_rl20*temp) < 0 AND temp_high_risk>0 THEN
				low_high := low_high + temp_high_risk;
				low_med := low_med + ((temp_high_risk-(constant_rl20*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl20*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl20*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl20*temp);
				low_med := low_med + (constant_rl20*temp);
			ELSEIF temp_med_risk-(constant_rl20*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				low_med:= low_med + temp_med_risk;
				low_low := low_low + ((temp_med_risk-(constant_rl20*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl20*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl20*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl20*temp);
				low_low := low_low + (constant_rl20*temp);
			END IF;
			temp := temp - constant_rl20*temp;
			temp_area := temp_area - constant_rl20*temp_area;
		ELSEIF temp_dis_percent>0 AND temp_dis_percent<=25 THEN
			verylow := verylow + constant_rl20*temp;
			verylow_area := verylow_area + constant_rl20*temp_area;
			IF temp_high_risk-(constant_rl20*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - (constant_rl20*temp);
				verylow_high := verylow_high + (constant_rl20*temp);
			ELSEIF temp_high_risk-(constant_rl20*temp) < 0 AND temp_high_risk>0 THEN
				verylow_high := verylow_high + temp_high_risk;
				verylow_med := verylow_med + ((temp_high_risk-(constant_rl20*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - (constant_rl20*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-(constant_rl20*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - (constant_rl20*temp);
				verylow_med := verylow_med + (constant_rl20*temp);
			ELSEIF temp_med_risk-(constant_rl20*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				verylow_med:= verylow_med + temp_med_risk;
				verylow_low := verylow_low + ((temp_med_risk-(constant_rl20*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - (constant_rl20*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-(constant_rl20*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - (constant_rl20*temp);
				verylow_low := verylow_low + (constant_rl20*temp);
			END IF;
			temp := temp - constant_rl20*temp;
			temp_area := temp_area - constant_rl20*temp_area;
		END IF;
		-- temp := temp - extreme - veryhigh - high - moderate - low - verylow;

		temp_rl20 := 0;
		IF temp_dis_percent>125 THEN
			temp_rl20 := temp_dis_percent - 100;
		END IF;
			
		IF temp_dis_percent>125 THEN
			veryhigh := veryhigh + (temp_rl20/100)*temp;
			veryhigh_area := veryhigh_area + (temp_rl20/100)*temp_area;
			IF temp_high_risk-((temp_rl20/100)*temp) >= 0 AND temp_high_risk>0 THEN
				temp_high_risk = temp_high_risk - ((temp_rl20/100)*temp);
				veryhigh_high := veryhigh_high + ((temp_rl20/100)*temp);
			ELSEIF temp_high_risk-((temp_rl20/100)*temp) < 0 AND temp_high_risk>0 THEN
				veryhigh_high := veryhigh_high + temp_high_risk;
				veryhigh_med := veryhigh_med + ((temp_high_risk-((temp_rl20/100)*temp))*-1);
				temp_med_risk = temp_med_risk + (temp_high_risk - ((temp_rl20/100)*temp));
				temp_high_risk = 0;
			ELSEIF temp_med_risk-((temp_rl20/100)*temp) >= 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				temp_med_risk = temp_med_risk - ((temp_rl20/100)*temp);
				veryhigh_med := veryhigh_med + ((temp_rl20/100)*temp);
			ELSEIF temp_med_risk-((temp_rl20/100)*temp) < 0 AND temp_med_risk>0 AND temp_high_risk<=0 THEN
				veryhigh_med := veryhigh_med + temp_med_risk;
				veryhigh_low := veryhigh_low + ((temp_med_risk-((temp_rl20/100)*temp))*-1);
				temp_low_risk = temp_low_risk + (temp_med_risk - ((temp_rl20/100)*temp));
				temp_med_risk = 0;
			ELSEIF temp_low_risk-((temp_rl20/100)*temp) >= 0 AND temp_low_risk>0 AND temp_high_risk<=0 AND temp_med_risk<=0 THEN
				temp_low_risk = temp_low_risk - ((temp_rl20/100)*temp);
				veryhigh_low := veryhigh_low + ((temp_rl20/100)*temp);
			END IF;
			temp := temp - ((temp_rl20/100)*temp);
			temp_area := temp_area - ((temp_rl20/100)*temp_area);
		END IF;

	        RETURN NEXT;
	     END LOOP;
	END; $BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION public.get_glofas(date, character varying, integer, character varying)
  OWNER TO postgres;
