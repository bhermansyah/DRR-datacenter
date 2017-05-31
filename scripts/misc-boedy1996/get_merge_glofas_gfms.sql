-- Function: public.get_merge_glofas_gfms(date, character varying, integer, character varying)

-- DROP FUNCTION public.get_merge_glofas_gfms(date, character varying, integer, character varying);

CREATE OR REPLACE FUNCTION public.get_merge_glofas_gfms(IN p_date date, IN p_filter character varying, IN p_code integer, IN p_spatial character varying)
  RETURNS TABLE(basin_id bigint, extreme double precision, veryhigh double precision, high double precision, moderate double precision, low double precision, verylow double precision, extreme_high double precision, extreme_med double precision, extreme_low double precision, veryhigh_high double precision, veryhigh_med double precision, veryhigh_low double precision, high_high double precision, high_med double precision, high_low double precision, moderate_high double precision, moderate_med double precision, moderate_low double precision, low_high double precision, low_med double precision, low_low double precision, verylow_high double precision, verylow_med double precision, verylow_low double precision, extreme_area double precision, veryhigh_area double precision, high_area double precision, moderate_area double precision, low_area double precision, verylow_area double precision) AS
$BODY$
DECLARE 
    var_r record;
DECLARE temp double precision;

BEGIN

   FOR var_r IN(select 
	a.*,
	b.basin_id as gfms_basin_id,
	b.gfms_verylow_pop,
	b.gfms_low_pop,
	b.gfms_med_pop,
	b.gfms_high_pop,
	b.gfms_veryhigh_pop,
	b.gfms_extreme_pop,
	b.gfms_verylow_area,
	b.gfms_low_area,
	b.gfms_med_area,
	b.gfms_high_area,
	b.gfms_veryhigh_area,
	b.gfms_extreme_area
	from afg_sheda_lvl4 c
	left join get_gfms_query(p_date,p_filter,p_code,p_spatial) b on b.basin_id=c.value
	left join get_glofas(p_date-1,p_filter,p_code,p_spatial) a on a.basin_id=c.value)  
     LOOP
	IF var_r.basin_id IS NOT NULL THEN
		basin_id := var_r.basin_id; 

		extreme := var_r.extreme;
		veryhigh := var_r.veryhigh;
		high := var_r.high;
		moderate := var_r.moderate;
		low := var_r.low;
		verylow := var_r.verylow;

		extreme_high := var_r.extreme_high;
		extreme_med := var_r.extreme_med;
		extreme_low := var_r.extreme_low;
		veryhigh_high := var_r.veryhigh_high;
		veryhigh_med := var_r.veryhigh_med;
		veryhigh_low := var_r.veryhigh_low;
		high_high := var_r.high_high;
		high_med := var_r.high_med;
		high_low := var_r.high_low;
		moderate_high := var_r.moderate_high;
		moderate_med := var_r.moderate_med;
		moderate_low := var_r.moderate_low;
		low_high := var_r.low_high;
		low_med := var_r.low_med;
		low_low := var_r.low_low;
		verylow_high := var_r.verylow_high;
		verylow_med := var_r.verylow_med;
		verylow_low := var_r.verylow_low;

		extreme_area := var_r.extreme_area;
		veryhigh_area := var_r.veryhigh_area;
		high_area := var_r.high_area;
		moderate_area := var_r.moderate_area;
		low_area := var_r.low_area;
		verylow_area := var_r.verylow_area;

	ELSE
		basin_id := var_r.gfms_basin_id; 

		extreme := var_r.gfms_extreme_pop;
		veryhigh := var_r.gfms_veryhigh_pop;
		high := var_r.gfms_high_pop;
		moderate := var_r.gfms_med_pop;
		low := var_r.gfms_low_pop;
		verylow := var_r.gfms_verylow_pop;

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

		extreme_area := var_r.gfms_extreme_area;
		veryhigh_area := var_r.gfms_veryhigh_area;
		high_area := var_r.gfms_high_area;
		moderate_area := var_r.gfms_med_area;
		low_area := var_r.gfms_low_area;
		verylow_area := var_r.gfms_verylow_area;
	END IF;	

        

        RETURN NEXT;
     END LOOP;
END; $BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION public.get_merge_glofas_gfms(date, character varying, integer, character varying)
  OWNER TO postgres;
