from django.views.generic import TemplateView


class WidgetView(TemplateView):

    template_name = 'widget.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["css_class"] = 'codemirror-widget'
        context["widget"] = {
            'attrs': {'id': 'id_code_css'},
            'name': 'code_css',
            'value': 'a {\n    color: #000;\n}',
        }
        return context
