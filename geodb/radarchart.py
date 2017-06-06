# # from matplotlib.ticker import FormatStrFormatter
# import numpy as np
# import pylab as pl
# import matplotlib.pyplot as plt
import StringIO
import base64
from graphos.renderers.base import BaseChart
import pygal
from pygal.style import Style
# from matplotlib.path import Path
# from matplotlib.spines import Spine
# from matplotlib.projections.polar import PolarAxes
# from matplotlib.projections import register_projection


class BaseMatplotlibChart(BaseChart):

    def get_template(self): 
        return "radar.html"

    def get_serieses(self):
        data_only = self.get_data()[1:]
        return data_only

    def get_xlabels(self):
    	response = []
    	for i in self.get_serieses():
    		response.append(i[0])
    	return response

    def get_opt_data(self, index):
    	response = []
    	for i in self.get_data()[1:]:
    		response.append(i[index])

    	return response	

class RadarChart(BaseMatplotlibChart):

    def get_image(self):
    	custom_style = Style(
		  background='#ffffff',
		  plot_background='#ffffff',
		  # foreground='#53E89B',
		  # foreground_strong='#53A0E8',
		  # foreground_subtle='#630C0D',
		  # opacity='.6',
		  # opacity_hover='.9',
		  # transition='400ms ease-in',
		  colors=('rgb(255, 0, 0)', 'rgb(18, 5, 240)', 'rgb(255, 153, 0)', 'rgb(16, 150, 24)'))
    	radar_chart = pygal.Radar(legend_at_bottom=True,width=450,height=450,style=custom_style,show_legend=False)
    	radar_chart.title = self.get_options()['title']
    	radar_chart.x_labels = self.get_xlabels()
    	for i in self.get_options()['col-included']:
    		radar_chart.add(i['name'], self.get_opt_data(i['col-no']), fill=i['fill'], show_dots=False, stroke_style={'width': 3, 'linecap': 'round', 'linejoin': 'round'})
    	# radar_chart.add('Dead', self.get_opt_data(2), fill=True, show_dots=False)
    	# radar_chart.add('Violent', self.get_opt_data(3), fill=True, show_dots=False)
    	# radar_chart.add('Injured', self.get_opt_data(4), fill=False, show_dots=False)
        return radar_chart.render_data_uri(human_readable=True)

        # return radar_chart



