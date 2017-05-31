-- Function: public.get_merge_glofas_gfms_detail(date)

-- DROP FUNCTION public.get_merge_glofas_gfms_detail(date);

CREATE OR REPLACE FUNCTION public.get_merge_glofas_gfms_detail(IN p_date date)
  RETURNS TABLE(basin_id bigint, dist_code integer, prov_code integer, extreme double precision, veryhigh double precision, high double precision, moderate double precision, low double precision, verylow double precision) AS
$BODY$
DECLARE 
    var_r record;
DECLARE temp double precision;

BEGIN

   FOR var_r IN(select distinct
	c.basin_id, c.dist_code, c.prov_code,
	a.basin_id as glofas_basin_id,
	a.extreme,
	a.veryhigh,
	a.high,
	a.moderate,
	a.low,
	a.verylow,
	b.basin_id as gfms_basin_id,
	b.gfms_verylow_pop,
	b.gfms_low_pop,
	b.gfms_med_pop,
	b.gfms_high_pop,
	b.gfms_veryhigh_pop,
	b.gfms_extreme_pop
	from afg_ppla_basin c
	left join get_gfms_detail(p_date) b on b.basin_id=c.basin_id and b.dist_code=c.dist_code
	left join get_glofas_detail(p_date-1) a on a.basin_id=c.basin_id and a.dist_code=c.dist_code
	where a.dist_code is not NULL or b.dist_code is not NULL
	order by c.basin_id, c.dist_code, c.prov_code)  
     LOOP
	IF var_r.glofas_basin_id IS NOT NULL THEN
		basin_id := var_r.basin_id; 
		dist_code := var_r.dist_code;
		prov_code := var_r.prov_code;
		extreme := var_r.extreme;
		veryhigh := var_r.veryhigh;
		high := var_r.high;
		moderate := var_r.moderate;
		low := var_r.low;
		verylow := var_r.verylow;

	ELSE
		basin_id := var_r.gfms_basin_id; 
		dist_code := var_r.dist_code;
		prov_code := var_r.prov_code;
		extreme := var_r.gfms_extreme_pop;
		veryhigh := var_r.gfms_veryhigh_pop;
		high := var_r.gfms_high_pop;
		moderate := var_r.gfms_med_pop;
		low := var_r.gfms_low_pop;
		verylow := var_r.gfms_verylow_pop;

		
	END IF;	

        

        RETURN NEXT;
     END LOOP;
END; $BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION public.get_merge_glofas_gfms_detail(date)
  OWNER TO postgres;
