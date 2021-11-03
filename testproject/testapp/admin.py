from django import forms
from django.contrib import admin

from min_codemirror.widgets import CodeMirrorWidget

from .models import Item, ItemStacked, ItemTabular


class ItemForm(forms.ModelForm):

    class Meta:
        fields = '__all__'
        model = Item
        widgets = {
            'code_css': CodeMirrorWidget(
                attrs={'rows': 4, 'cols': 12},
                conf='',
            ),
            'code_js': CodeMirrorWidget,
        }


class ItemStackedInline(admin.StackedInline):

    form = ItemForm
    model = ItemStacked
    extra = 0


class ItemTabularInline(admin.TabularInline):

    form = ItemForm
    model = ItemTabular
    extra = 0


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):

    form = ItemForm
    inlines = [
        ItemStackedInline,
        ItemTabularInline,
    ]
