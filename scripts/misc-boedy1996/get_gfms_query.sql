-- Function: public.get_gfms_query(date, character varying, integer, character varying)

-- DROP FUNCTION public.get_gfms_query(date, character varying, integer, character varying);

CREATE OR REPLACE FUNCTION public.get_gfms_query(IN p_date date, IN p_filter character varying, IN p_code integer, IN p_spt_filter character varying)
  RETURNS TABLE(basin_id double precision, gfms_verylow_pop double precision, gfms_low_pop double precision, gfms_med_pop double precision, gfms_high_pop double precision, gfms_veryhigh_pop double precision, gfms_extreme_pop double precision, gfms_verylow_area double precision, gfms_low_area double precision, gfms_med_area double precision, gfms_high_area double precision, gfms_veryhigh_area double precision, gfms_extreme_area double precision) AS
$BODY$
  BEGIN
   IF p_filter='entireAfg' THEN
	   RETURN QUERY
		SELECT 
		    afg_fldzonea_100k_risk_landcover_pop.basin_id,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 1 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_verylow_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 2 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_low_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 3 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_med_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 4 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_high_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 5 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_veryhigh_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 6 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_extreme_pop,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 1 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_verylow_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 2 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_low_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 3 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_med_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 4 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_high_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 5 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_veryhigh_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 6 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_extreme_area
		   FROM afg_fldzonea_100k_risk_landcover_pop
		     JOIN afg_sheda_lvl4 ON afg_fldzonea_100k_risk_landcover_pop.basinmember_id = afg_sheda_lvl4.ogc_fid
		     JOIN forcastedvalue ON afg_sheda_lvl4.ogc_fid = forcastedvalue.basin_id
		  WHERE NOT afg_fldzonea_100k_risk_landcover_pop.agg_simplified_description::text = 'Water body and marshland'::text AND NOT (afg_fldzonea_100k_risk_landcover_pop.basinmember_id IN ( SELECT u1.ogc_fid
			   FROM afg_sheda_lvl4 u1
			     LEFT JOIN forcastedvalue u2 ON u1.ogc_fid = u2.basin_id
			  WHERE u2.riskstate IS NULL)) AND forcastedvalue.forecasttype::text = 'riverflood'::text
				AND forcastedvalue.datadate = p_date
		  GROUP BY afg_fldzonea_100k_risk_landcover_pop.basin_id
		  ORDER BY afg_fldzonea_100k_risk_landcover_pop.basin_id;
    ELSEIF p_filter='currentProvince' THEN
	IF length(p_code::text)>2 THEN
		RETURN QUERY
			SELECT 
		    afg_fldzonea_100k_risk_landcover_pop.basin_id,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 1 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_verylow_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 2 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_low_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 3 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_med_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 4 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_high_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 5 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_veryhigh_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 6 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_extreme_pop,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 1 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_verylow_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 2 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_low_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 3 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_med_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 4 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_high_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 5 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_veryhigh_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 6 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_extreme_area
		   FROM afg_fldzonea_100k_risk_landcover_pop
		     JOIN afg_sheda_lvl4 ON afg_fldzonea_100k_risk_landcover_pop.basinmember_id = afg_sheda_lvl4.ogc_fid
		     JOIN forcastedvalue ON afg_sheda_lvl4.ogc_fid = forcastedvalue.basin_id
		  WHERE NOT afg_fldzonea_100k_risk_landcover_pop.agg_simplified_description::text = 'Water body and marshland'::text AND NOT (afg_fldzonea_100k_risk_landcover_pop.basinmember_id IN ( SELECT u1.ogc_fid
			   FROM afg_sheda_lvl4 u1
			     LEFT JOIN forcastedvalue u2 ON u1.ogc_fid = u2.basin_id
			  WHERE u2.riskstate IS NULL)) AND forcastedvalue.forecasttype::text = 'riverflood'::text
				AND forcastedvalue.datadate = p_date AND afg_fldzonea_100k_risk_landcover_pop.dist_code = p_code
		  GROUP BY afg_fldzonea_100k_risk_landcover_pop.basin_id
		  ORDER BY afg_fldzonea_100k_risk_landcover_pop.basin_id;
			
	ELSE
		RETURN QUERY
			SELECT 
		    afg_fldzonea_100k_risk_landcover_pop.basin_id,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 1 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_verylow_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 2 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_low_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 3 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_med_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 4 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_high_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 5 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_veryhigh_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 6 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_extreme_pop,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 1 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_verylow_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 2 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_low_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 3 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_med_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 4 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_high_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 5 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_veryhigh_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 6 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_extreme_area
		   FROM afg_fldzonea_100k_risk_landcover_pop
		     JOIN afg_sheda_lvl4 ON afg_fldzonea_100k_risk_landcover_pop.basinmember_id = afg_sheda_lvl4.ogc_fid
		     JOIN forcastedvalue ON afg_sheda_lvl4.ogc_fid = forcastedvalue.basin_id
		  WHERE NOT afg_fldzonea_100k_risk_landcover_pop.agg_simplified_description::text = 'Water body and marshland'::text AND NOT (afg_fldzonea_100k_risk_landcover_pop.basinmember_id IN ( SELECT u1.ogc_fid
			   FROM afg_sheda_lvl4 u1
			     LEFT JOIN forcastedvalue u2 ON u1.ogc_fid = u2.basin_id
			  WHERE u2.riskstate IS NULL)) AND forcastedvalue.forecasttype::text = 'riverflood'::text
				AND forcastedvalue.datadate = p_date AND afg_fldzonea_100k_risk_landcover_pop.prov_code = p_code
		  GROUP BY afg_fldzonea_100k_risk_landcover_pop.basin_id
		  ORDER BY afg_fldzonea_100k_risk_landcover_pop.basin_id;
	END IF;
    ELSE
		RETURN QUERY
			SELECT 
		    afg_fldzonea_100k_risk_landcover_pop.basin_id,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 1 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_verylow_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 2 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_low_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 3 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_med_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 4 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_high_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 5 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_veryhigh_pop,
		    round(sum(
			CASE
			    WHEN forcastedvalue.riskstate = 6 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_population
			    ELSE 0::double precision
			END)) AS gfms_extreme_pop,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 1 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_verylow_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 2 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_low_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 3 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_med_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 4 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_high_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 5 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_veryhigh_area,
		    sum(
			CASE
			    WHEN forcastedvalue.riskstate = 6 THEN afg_fldzonea_100k_risk_landcover_pop.fldarea_sqm
			    ELSE 0::double precision
			END) / 1000000::double precision AS gfms_extreme_area
		   FROM afg_fldzonea_100k_risk_landcover_pop
		     JOIN afg_sheda_lvl4 ON afg_fldzonea_100k_risk_landcover_pop.basinmember_id = afg_sheda_lvl4.ogc_fid
		     JOIN forcastedvalue ON afg_sheda_lvl4.ogc_fid = forcastedvalue.basin_id
		  WHERE NOT afg_fldzonea_100k_risk_landcover_pop.agg_simplified_description::text = 'Water body and marshland'::text AND NOT (afg_fldzonea_100k_risk_landcover_pop.basinmember_id IN ( SELECT u1.ogc_fid
			   FROM afg_sheda_lvl4 u1
			     LEFT JOIN forcastedvalue u2 ON u1.ogc_fid = u2.basin_id
			  WHERE u2.riskstate IS NULL)) AND forcastedvalue.forecasttype::text = 'riverflood'::text
				AND forcastedvalue.datadate = p_date AND ST_Within(afg_fldzonea_100k_risk_landcover_pop.wkb_geometry, ST_GeometryFromText(p_spt_filter, 4326))
		  GROUP BY afg_fldzonea_100k_risk_landcover_pop.basin_id
		  ORDER BY afg_fldzonea_100k_risk_landcover_pop.basin_id;
	
    END IF;
 END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION public.get_gfms_query(date, character varying, integer, character varying)
  OWNER TO postgres;
