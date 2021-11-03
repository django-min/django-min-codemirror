# import os
import min_codemirror
from setuptools import setup, find_packages


def readme():
    with open('README.md') as f:
        return f.read()


setup(
    name='django-min-codemirror',
    version=min_codemirror.__version__,
    author='Alaric Mägerle',
    author_email='info@rouxcode.ch',
    description='django-min codemirror widget',
    long_description=readme(),
    url='https://github.com/django-min/django-min-codemirror',
    license='MIT',
    keywords=['django'],
    platforms=['OS Independent'],
    classifiers=[
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules',
        'Development Status :: 3 - Alpha',
    ],
    install_requires=[
        'django>=3.2,<3.3',
    ],
    packages=find_packages(exclude=[
        'docs'
        'example',
    ]),
    include_package_data=True,
    zip_safe=False,
)
