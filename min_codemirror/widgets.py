from django import forms
from django.utils.safestring import mark_safe


class CodeMirrorWidget(forms.Textarea):

    widget = forms.Textarea
    template_name = 'min_codemirror/widget.html'

    class Media:
        css = {
            'screen': [
                'min_codemirror/widget.css',
            ],
        }
        js = [
            'min_codemirror/widget.js',
        ]

    def __init__(self, code_language='html', attrs=None):
        self.code_language = code_language
        super().__init__(attrs)

    def get_context(self, *args, **kwargs):
        context = super().get_context(*args, **kwargs)
        context['css_class'] = self.get_css_class()
        context['data_attrs'] = self.get_data_attrs()
        return context

    def get_css_class(self):
        classes = ['codemirror-widget']
        return mark_safe(' '.join(classes))

    def get_data_attrs(self):
        data = [
            'data-code_language="{}"'.format(self.code_language)
        ]
        return mark_safe(' '.join(data))
