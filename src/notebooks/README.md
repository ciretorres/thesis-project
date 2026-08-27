# notebooks

![](https://img.shields.io/badge/status-in%20progress-yellow)

La Agencia Espacial Europea ([ESA](https://www.esa.int/)) lanzó en 1989 la misión espacial con el satélite **HIgh Precision PARallax COllecting Satellite** o [Hipparcos](https://sci.esa.int/web/hipparcos/). El satélite estuvo en fase de operación y comunicación hasta 1993, debido a que este se detuvo y se comenzó con la fase de recuperación con la información recolectada.

En 1997 se publicaron los datos de Hipparcos en revistas académicas y se insertaron en la página de [VizieR](https://vizier.cds.unistra.fr/): un servicio de catálogos, tablas y bases astronómicas del Centro de Datos Astronómicos de Estrasburgo ([CDS](https://cds.unistra.fr/)) en Francia. El catálogo tuvo una modificación en 2021.

Los catálogos de [The Hipparcos and Tycho Catalogue: I/239](http://cdsarc.u-strasbg.fr/viz-bin/cat/I/239#/browse) son mapas estelares con información astrométrica (posición) y fotométrica (brillo) de las estrellas y objetos celestes. El catálogo cuenta con _118,218_ registros (filas) y _81_ variables (columnas).

## Módulo de análisis pandas de datos astronómicos

La idea es integrar todo lo analizado del proyecto anterior de [**HipparcosMainCatalogue.ipynb**](https://github.com/ciretorres/thesis-project/blob/v1.0.0/Prototype_v1/data/HipparcosMainCatalogue.ipynb) y mejorarlo.

Los submódulos son los siguientes:

- `0Vizier.ipynb` es un prueba que realicé para obtener el catálogo por medio de la instancia de **Vezier** con el módulo de [astroquery](https://astroquery.readthedocs.io/en/latest/). Esta me devuelve una tabla que se puede exportar a csv, tsv, json u otros.
-
- `1Introducción.ipynb` aquí se realiza la lectura del catálogo en archivo de formato .tsv mediante el módulo de [pandas](https://pandas.pydata.org/). Así como, la generación de un perfil con un reporte corto sobre la información en el catálogo por medio del módulo de [data_profiling](https://github.com/Data-Centric-AI-Community/fg-data-profiling).
-
- `2Limpieza.ipynb` se identifican los elementos que tienen valor NaN o null con el fin de remover las malas entradas o con alto error. Además, se filtran los registros en donde la columna de **Plx** sea mayor a 0. Se exporta este nuevo dataframe en un archivo tsv.
-
- `3Exploracion.ipynb` se utiliza el dataframe limpio y se realiza una revisión general de los datos del catálogo con relaciones y variables específicas. Este es el caso de las distribuciones sobre distancia y brillo en astronomía.
-
- `4Seleccion.ipynb` se elige lo relevante para el proyecto como las variables: **HIP, Rahms, Dedms, Vmag, Plx, RAICRS, DEICRS**.
  - Se calcula la magnitud absoluta (ABSmag) con la información en las columnas de **Vmag** y **Plx**.
  - Se calcula la distancia de las estrellas en unidades pársecs (Pc) y años luz (Ly) utilizando las columnas de **Vmag** y **ABSmag**.
  - Se transforman las coordenas ecuatoriales de las columnas **RAICRS** y **DEICRS** con la distancia **Pc** a coordenadas cartesianas esféricas **X**, **Y**, **Z** mediante el módulo de [astropy](https://www.astropy.org/) y la instancia de [SkyCoord](https://docs.astropy.org/en/stable/coordinates/index.html).
  - Se exporta este dataframe en un nuevo archivo json para el desarrollo en la interfaz del frontend de un planetario interactivo.
- `Estadistica.ipynb` se integran diversos métodos con el fin de responder a preguntas específicas y visualizarlas mediante gráficas de plots. Por ejemplo:
  - El sistema de coordenadas astronómico
  - El movimiento propio de las estrellas
  - El diagrama de Hertzsprung-Russell (HR)
  - Las estrellas más prominentes
  - Las 10 o 50 estrellas más brillantes
  - Las 5 o 20 estrellas más cercas al sol
  - Machine learning
  - Probabilidad, kmeans, DBSCAN, por mencionar algunos.
- `hip_main.ipynb` es un intento por realizar el análisis utilizando el módulo de [pandas](https://pandas.pydata.org/) en lugar de [datascience](https://github.com/data-8/datascience) con el archivo con extensión .dat que obtuve al principio de la construcción del prototipo. Este último módulo se utilizó en la [Universidad de Berkeley](https://github.com/ds-modules) para el desarrollo del curso de ciencia de datos en edX donde comencé la introducción al lenguaje de python.

### Introducción

### Descarga de archivos

1. Ingresar al sitio de [The Hipparcos and Tycho Catalogues : I/239 ](https://cdsarc.cds.unistra.fr/viz-bin/cat/I/239#)
2. Navegar al catalogo de [Vizier](http://vizier.cds.unistra.fr/viz-bin/VizieR?-source=I/239)
3. Entrar a la opción de [I/239/hip_main](http://vizier.cds.unistra.fr/viz-bin/VizieR-3?-source=I/239/hip_main)
4. Seleccionar las preferencias del panel izquierdo con filas ilimitadas y la opción de todas las columnas
5. Guardar selección y almacenar los resultados en el portal del Centro de Datos de Estrasburgo (CDS).
6. Descargar el archivo el catálogo en [My Data](http://cdsportal.u-strasbg.fr/my-data/)

### ParserError: Error tokenizing data. C error: Expected 81 fields in line 1902, saw 82

Este error me salió al utilizar el archivo con extensión csv.

Al investigar resulta que en el catálogo existen varios registros en donde en valor en celda incluye una coma (,) y esto rompe el esquema de separación de columnas en el archivo csv al leerse con pandas.

Aquí la captura con el ejemplo de la fila 1902:

<img src="../../static/capturas/Screen Shot 2026-07-20 at 23.22.50.webp" width="800">

Por este motivo, se tomó la decisión de usar el archivo con extensión tsv.

```python
import pandas

file = "data_raw/vizier_I_239_hip_main_20260720.tsv"

# leer .tsv
df = pandas.read_csv(
    file,              # nombre y ruta del archivo
    sep='\t',          # símbolo de separación de columnas
    nrows = 118218,    # número de filas que se leerán
    index_col = 'HIP', # nombre de la columna índice
)
```

### Exploración

Se revisa la información sobre la distancia (Plx) y el brillo o magnitud visual aparente (Vmag) que recolectó el satélite y el equipo de la misión.

#### Plx

Esta columna del catálogo representa el paralaje o la distancia de la estrella en miliarcos de segundo.

#### Vmag

Esta columna del catálogo representa el brillo de las estrellas que vemos a simple vista o la magnitud visual lumínica aparente.

- Se identifican 1,126 valores únicos en esta columna.
- No se recolectaron estrellas con magnitud de 0.00 y 0.01, pero sí se encontró una con magnitud **-0.01** con el **HIP 71683**.
- Solo cuatro estrellas se identificaron con magnitud menores a cero (< 0).
- La estrella más brillate es Sirius con **-1.44** de brillo aparente y el **HIP 32349**.
- Los máximos y mínimos de Vmag (14.08, -1.44) y Plx (772.33, -54.95).

### Selección

Se eligió y utilizó la información contenida en las variables **HIP, Rahms, Dedms, Vmag, Plx, RAICRS y DEICRS**, puesto que son relevantes en el proyecto para:

- Calcular la magnitud absoluta (ABSmag) con la información en las columnas de **Vmag** y **Plx**. El paralaje se convitió de mili arcos de segundo a arcos de segundo.

```
M = m + 5 + 5 log π
```

```python
import numpy as np

def calculate_abs_mag(apparent_magnitude, milliarcsecond):
    """
        Calcula la magnitud absoluta de la forma:

        M = m + 5 + 5 log π"

        @params {Series} apparent_magnitude: el brillo a simple vista
        @params {Series} milliarcsecond: la distancia en mas
        @returns {Series} absolute_magnitude
    """

    arcsecond = milliarcsecond / 1000
    absolute_magnitude = ( np.log10( arcsecond ) * 5 ) + 5 + apparent_magnitude

    return absolute_magnitude
```

```python
absolute_magnitude = calculate_abs_mag(df['Vmag'], df['Plx'])
absolute_magnitude
```

- Calcular la distancia de las estrellas en unidades pársecs (Pc) y años luz (Ly) utilizando las columnas de **Vmag** y **ABSmag**.

```python
def calculate_distance(apparent_magnitude, absolute_magnitude):
    """ Calcula  distancia de la forma:

        d = 10**((m - M + 5) / 5)

        La diferencia de las magnitudes más cinco sobre cinco,
        es igual a logaritmo de 10 igual a la distancia en pársecs.

        @params {Series} apparent_magnitude: el brillo a simple vista
        @params {Series} milliarcsecond: la distancia en mas
        @returns {Series} absolute_magnitude
    """

    logarithm = ( apparent_magnitude - absolute_magnitude  + 5) / 5
    parsecs = 10**logarithm

    return parsecs

```

```python
parsecs = calculate_distance( df_selection['Vmag'], df_selection['ABSmag'] )
```

```python
lightyears = df_selection["Pc"] * 3.261598
```

- Transformar las coordenadas ecuatoriales de las columnas **RAICRS** y **DEICRS** en grados con la distancia en pársecs **Pc** a coordenadas cartesianas esféricas **X**, **Y**, **Z** mediante el módulo de [astropy](https://www.astropy.org/) y la instancia de [SkyCoord](https://docs.astropy.org/en/stable/coordinates/index.html).

```python
# pip install astropy
from astropy import units as u
from astropy.coordinates import SkyCoord

ra_series = df_selection["RAICRS"]
dec_series = df_selection["DEICRS"]
pc_series = df_selection["Pc"]

# Convertir a array antes de pasarlo a SkyCoord
ra = np.asarray(ra_series) * u.deg
dec = np.asarray(dec_series) * u.deg
pc = np.asarray(pc_series) * u.pc

coordinates = SkyCoord(ra=ra, dec=dec, distance=pc, frame="icrs").cartesian
```

- Exportar este dataframe en un nuevo archivo json para el desarrollo en la interfaz del frontend de un planetario interactivo.

```python
# exporta el dataframe a  .json
out_file = "data_clean/vizier_I_239_hip_main_10pc"

df_10pc.to_json(out_file + ".json", orient="table")
```

Aquí se toma una decisión. Exportar el dataframe con los 113,710 registros o filtrarlo por distancia.

- Puesto que al colocar los 113,710 en la visualización 3D se vuelve lenta e imposible de interactuar. La distancia se normaliza De manera logarítmica para que 1 pársec equivalga a 10px o 100px y evitar así que se amontonen los puntos.

Por lo que se decide filtrar el dataframe a estrellas menores a 1000 pársecs. Esto nos reduce a **107,380 filas**. A 100 pársecs equivale a **22,982 filas**. Con 10 pársec a **182 filas o estrellas**.

La estrella polaris se encuentra a 132 pársecs aproximadamente de distancia. Es importante para nosotros presentarla al menos en la interfaz interactiva.

--

Aquí podría concluir la primera etapa o versión del análisis. Lo siguiente podría ser mejorar o dejar más simple y un poco minimalsita el notebook principal o hacerlo en subnotebooks.

Para que del mismo modo convivan otros notebooks para informar sobre las preguntas y métodos que encontramos en el camino de realizar este análisis completo.

Y posteriormente añadirlo a un módulo de backend con node, mongodb, django o postgress para exponer o servirlo mediante una api la información del catálogo analizada (csv, json, mysql) en un servidor local con una imagen docker.

### Estadística y visualización

```

```

## Lista de referencias

[https://cdsarc.cds.unistra.fr/ftp/I/239/ReadMe](https://cdsarc.cds.unistra.fr/ftp/I/239/ReadMe)

--

[https://sci.esa.int/web/hipparcos/](https://sci.esa.int/web/hipparcos/)

[https://www.cosmos.esa.int/web/hipparcos/home](https://www.cosmos.esa.int/web/hipparcos/home)

[https://www.cosmos.esa.int/web/hipparcos/catalogues](https://www.cosmos.esa.int/web/hipparcos/catalogues)

[https://link.springer.com/chapter/10.1007/978-981-99-9818-0_20](https://link.springer.com/chapter/10.1007/978-981-99-9818-0_20)

[https://sci.esa.int/web/hipparcos/-/35890-summary-of-hipparcos-mission](https://sci.esa.int/web/hipparcos/-/35890-summary-of-hipparcos-mission)

[https://sci.esa.int/web/hipparcos/-/53169-hipparcos-integration-with-ariane-4](https://sci.esa.int/web/hipparcos/-/53169-hipparcos-integration-with-ariane-4)

[https://sci.esa.int/web/hipparcos/-/53171-ariane-4-v33-on-launch-pad-with-hipparcos](https://sci.esa.int/web/hipparcos/-/53171-ariane-4-v33-on-launch-pad-with-hipparcos)

--

[ESASky](https://sky.esa.int/esasky/?target=128.8222097404772%2028.4734023755302&hips=DSS2+color&fov=0.09999999999998795&projection=SIN&cooframe=J2000&sci=true&lang=es)

[https://sci.esa.int/web/hipparcos/-/53176-the-hipparcos-science-team](https://sci.esa.int/web/hipparcos/-/53176-the-hipparcos-science-team)

[https://www.esa.int/ESA_Multimedia/Images/2016/09/ESA_s_Star_Mapper_visualisation](https://www.esa.int/ESA_Multimedia/Images/2016/09/ESA_s_Star_Mapper_visualisation)

[https://sci.esa.int/web/hipparcos/-/59486-esa-star-mapper-visualisation-demo](https://sci.esa.int/web/hipparcos/-/59486-esa-star-mapper-visualisation-demo)

[ESA Star Mapper](https://sci.esa.int/star_mapper/)

[https://stellarium-web.org/](https://stellarium-web.org/)

--

[https://github.com/Data-Centric-AI-Community/fg-data-profiling](https://github.com/Data-Centric-AI-Community/fg-data-profiling)

--

[https://www.kaggle.com/datasets/konivat/hipparcos-star-catalog/code](https://www.kaggle.com/datasets/konivat/hipparcos-star-catalog/code)

Profiling

[https://www.kaggle.com/code/konivat/hipparcos-dataset-profiling-report](https://www.kaggle.com/code/konivat/hipparcos-dataset-profiling-report)

[https://www.kaggle.com/code/ctzenscientist/astronomy-101-with-hipparchos-catalogue](https://www.kaggle.com/code/ctzenscientist/astronomy-101-with-hipparchos-catalogue)

HR Diagram

[https://www.kaggle.com/code/ernestbavarsad/hippacros-data-analysis-ernest-b](https://www.kaggle.com/code/ernestbavarsad/hippacros-data-analysis-ernest-b)

[https://www.kaggle.com/code/cosmopablovd/hipparcos-eda](https://www.kaggle.com/code/cosmopablovd/hipparcos-eda)

[https://www.kaggle.com/code/onielg/hrstaranalysis](https://www.kaggle.com/code/onielg/hrstaranalysis)

[https://www.kaggle.com/code/davidjoiner/hipparcos](https://www.kaggle.com/code/davidjoiner/hipparcos)

[https://www.kaggle.com/code/fernandolima23/hrdiagram](https://www.kaggle.com/code/fernandolima23/hrdiagram)

[https://www.kaggle.com/code/ricardodarocha/diagrama-hr-com-python](https://www.kaggle.com/code/ricardodarocha/diagrama-hr-com-python)

[https://www.kaggle.com/code/davidjoiner/ms-final-project-advanced-seminar-5631](https://www.kaggle.com/code/davidjoiner/ms-final-project-advanced-seminar-5631)

[https://www.kaggle.com/code/jessersallemi/star-classification-3d-model](https://www.kaggle.com/code/jessersallemi/star-classification-3d-model)

SkyCoord

[https://www.kaggle.com/code/edwinmelgarejoaburto/astropy-coords-edwin-melgarejo-aburto](https://www.kaggle.com/code/edwinmelgarejoaburto/astropy-coords-edwin-melgarejo-aburto)

[https://www.kaggle.com/code/lupevazquez/astropy-coords-guadalupe-vazquez](https://www.kaggle.com/code/lupevazquez/astropy-coords-guadalupe-vazquez)

[https://www.kaggle.com/code/monicamartinezalba/astropy-coords-monica-martinez](https://www.kaggle.com/code/monicamartinezalba/astropy-coords-monica-martinez)

Astropy
[https://www.kaggle.com/code/edwinmelgarejoaburto/astropy-coords-edwin-melgarejo-aburto?select=hipparcos-voidmain.csv](https://www.kaggle.com/code/edwinmelgarejoaburto/astropy-coords-edwin-melgarejo-aburto?select=hipparcos-voidmain.csv)

DBSCAN

[https://www.kaggle.com/code/ernestbavarsad/galactic-dynamics-w-hippacros](https://www.kaggle.com/code/ernestbavarsad/galactic-dynamics-w-hippacros)

[https://www.kaggle.com/code/ernestbavarsad/hippacros-membership-probability-ernest-b](https://www.kaggle.com/code/ernestbavarsad/hippacros-membership-probability-ernest-b)

[https://www.kaggle.com/code/johnmcevoy/john-mcevoy-5612-ad-sem-comp-sci-final-project](https://www.kaggle.com/code/johnmcevoy/john-mcevoy-5612-ad-sem-comp-sci-final-project)

[https://www.kaggle.com/code/davidjoiner/clusteringinhipparcos](https://www.kaggle.com/code/davidjoiner/clusteringinhipparcos)

ML

[https://www.kaggle.com/code/cosmopablovd/hipparcosml](https://www.kaggle.com/code/cosmopablovd/hipparcosml)

D3js

[https://www.kaggle.com/code/therohk/hipparcos-stars-spherical-skymap/report](https://www.kaggle.com/code/therohk/hipparcos-stars-spherical-skymap/report)

--

[http://casu.ast.cam.ac.uk/casuadc](http://casu.ast.cam.ac.uk/casuadc)

[https://www.cosmos.esa.int/web/hipparcos/closest-stars](https://www.cosmos.esa.int/web/hipparcos/closest-stars)

[https://www.kaggle.com/code/konivat/hipparcos-dataset-profiling-report/notebook](https://www.kaggle.com/code/konivat/hipparcos-dataset-profiling-report/notebook)
