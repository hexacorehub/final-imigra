import type { Messages } from './pt';

// Interface text in Spanish. Official content from the knowledge base is still in Portuguese.
const es: Messages = {
	appName: 'Rumo',
	tagline: 'Tu paso a paso para vivir en Brasil, con base en fuentes oficiales.',
	disclaimer: 'App independiente, sin vínculo con la Policía Federal ni otros órganos públicos. No reemplaza la orientación jurídica.',
	privacy: 'Tus respuestas se quedan solo en tu celular.',
	languageTitle: 'Elige tu idioma',
	languageLabel: 'Idioma',
	contentInPortuguese: 'La información oficial todavía está en portugués. Pronto la traduciremos.',
	start: 'Empezar',
	continue: 'Continuar',
	back: 'Volver',
	edit: 'Editar',
	loading: 'Cargando…',
	stepOf: 'Paso {n} de {total}',
	offlineReady: 'Funciona sin internet después de la primera visita.',

	country: {
		title: '¿De qué país eres?',
		lead: 'Tu nacionalidad define qué caminos existen para ti.',
		search: 'Buscar país',
		searchPlaceholder: 'Escribe el nombre del país',
		popular: 'Más elegidos',
		results: 'Resultados',
		noResults: 'No encontramos ningún país.',
		showAll: 'Ver todos los países',
		groups: {
			Mercosul: 'Mercosur',
			'Fronteiriço sem acordo Mercosul': 'Fronterizo',
			'Acolhida humanitária': 'Acogida humanitaria',
			CPLP: 'CPLP',
			'Caso específico': 'Caso específico'
		}
	},

	situation: {
		title: 'Tu situación ahora',
		whereTitle: '¿Dónde estás?',
		inBrazil: 'En Brasil',
		abroad: 'En el exterior',
		city: 'Ciudad',
		cityName: 'São Paulo – SP',
		cityNote: 'Por ahora Rumo cubre la ciudad de São Paulo.',
		cpfTitle: '¿Ya tienes CPF?',
		cpfYes: 'Sí',
		cpfNo: 'No',
		cpfUnknown: 'No sé qué es',
		cpfInfoTitle: '¿Qué es el CPF?',
		cpfAdded: 'Vamos a poner el CPF en tu camino.',
		docTitle: '¿Qué documento brasileño ya tienes?',
		docs: {
			none: 'Ninguno todavía',
			protocol: 'Protocolo de refugio',
			dprnm: 'DPRNM (documento provisorio)',
			crnm: 'CRNM (carné de registro)',
			visa: 'Visa temporal',
			dou: 'Autorización publicada en el Diário Oficial',
			unknown: 'No sé'
		}
	},

	goals: {
		title: '¿Qué necesitas ahora?',
		lead: 'Puedes marcar más de uno.',
		live: 'Vivir legalmente en Brasil',
		liveHint: 'Autorización de residencia en la Policía Federal',
		family: 'Traer o reunirme con un familiar',
		familyHint: 'Reunificación familiar',
		refuge: 'Pedir protección (refugio)',
		refugeHint: 'Si temes volver a tu país. Es gratis y tiene reglas propias.',
		address: 'Cambiar mi dirección en el registro',
		addressHint: 'En línea y gratis, en la Policía Federal',
		seeSummary: 'Ver mi resumen'
	},

	summary: {
		title: 'Revisa tu perfil',
		nationality: 'Nacionalidad',
		situation: 'Dónde estás · documento · CPF',
		goals: 'Qué necesitas',
		noCpf: 'sin CPF',
		hasCpf: 'con CPF',
		pathTitle: 'Caminos para ti',
		build: 'Armar mi camino',
		notOfficial: 'Orientación basada en fuentes oficiales. No es una decisión del gobierno.',
		addedNoCpf: 'Agregado porque todavía no tienes CPF'
	},

	path: {
		title: 'Mi camino',
		profileLine: 'Perfil: {country} · {city}',
		progress: '{done} de {total} etapas listas',
		empty: 'Responde algunas preguntas para armar tu camino.',
		startTriage: 'Empezar',
		open: 'Ver qué llevar',
		docsReady: '{done} de {total} documentos listos',
		redo: 'Rehacer preguntas'
	},

	notices: {
		abroad: 'Fuera de Brasil, el trámite empieza en el consulado brasileño. Rumo todavía no cubre ese camino.',
		'has-crnm': 'Ya tienes la CRNM. Si está por vencer, busca el CRAI para saber el próximo paso.',
		'own-modality': 'Tu nacionalidad tiene una modalidad propia en la Policía Federal ({modalities}). Rumo todavía no detalla ese camino: habla con el CRAI.',
		'no-specific-modality': 'No encontramos una modalidad de residencia específica para tu nacionalidad. Mira si la reunificación familiar o el refugio se aplican a ti, o habla con el CRAI.',
		'nothing-selected': 'No marcaste ningún objetivo. Vuelve y elige lo que necesitas.',
		talkToCrai: 'Hablar con el CRAI'
	},

	reasons: {
		'no-cpf': 'Agregado porque todavía no tienes CPF',
		residence: 'Para tu nacionalidad',
		registration: 'Porque ya tienes visa o autorización publicada',
		family: 'Pediste reunificación familiar',
		refuge: 'Pediste refugio',
		'refuge-document': 'Documento para quien pide refugio',
		address: 'Pediste cambiar la dirección'
	},

	procedures: {
		'P-CPF': 'Sacar el CPF',
		'P-RES-VEN': 'Autorización de residencia (Venezuela, Guyana, Surinam)',
		'P-RES-MERCOSUL': 'Autorización de residencia por el Acuerdo Mercosur',
		'P-RES-REUNIAO': 'Reunificación familiar',
		'P-REG-CRNM': 'Registro y carné (CRNM)',
		'P-REFUGIO': 'Pedir refugio',
		'P-DPRNM': 'Documento provisorio (DPRNM)',
		'P-ENDERECO': 'Actualizar dirección en el registro',
		'P-COMPROVANTE': 'Comprobante de domicilio'
	},

	procedure: {
		whoCanApply: 'Quién puede pedirlo',
		where: 'Dónde pedirlo',
		cost: 'Costo',
		timing: 'Plazos',
		legalBasis: 'Base legal',
		whatIsIt: '¿Qué es y por qué lo necesito?',
		documents: 'Qué llevar',
		steps: 'Paso a paso',
		markReady: 'Marcar como listo',
		ready: 'Listo',
		howToGet: 'Cómo conseguirlo',
		alternatives: 'Alternativas aceptadas',
		formalities: 'Traducción y apostilla',
		condition: 'Cuándo se pide',
		unconfirmedHelp: 'No pudimos confirmar este punto en una fuente oficial. Confírmalo en el canal oficial antes de ir.',
		officialChannel: 'Canal oficial',
		sources: 'Fuentes',
		verifiedAt: 'Verificado el {date}',
		restricted: 'la página pedía login al verificar',
		secondary: 'fuente no oficial',
		backToPath: 'Volver a mi camino',
		stage: 'Cuándo presentarlo'
	},

	status: {
		required: 'Obligatorio',
		conditional: 'Condicional',
		unconfirmed: 'Por confirmar',
		not_required: 'No exigido'
	},

	nav: { path: 'Mi camino', city: 'Ciudad', help: 'Ayuda' },

	city: {
		title: 'Guía de la ciudad',
		healthTitle: 'Salud: ¿adónde ir?',
		susRight: 'Los inmigrantes tienen acceso a los servicios públicos de salud, sin discriminación por nacionalidad o situación migratoria.',
		susSource: 'Ley de Migración (Ley 13.445/2017), art. 4º, VIII',
		ubs: 'Puesto de salud (UBS)',
		ubsText: 'Consultas, vacunas y Tarjeta SUS. Para el día a día.',
		upa: 'UPA 24h',
		upaText: 'Urgencia: fiebre alta, cortes, dolor fuerte. Abierta 24 horas.',
		hospital: 'Sala de emergencias',
		hospitalText: 'Emergencia grave: falta de aire, dolor en el pecho, accidente.',
		generalGuidance: 'Orientación general; si tienes dudas, llama al 192.',
		emergencyTitle: 'Emergencia',
		police: 'Policía',
		ambulance: 'SAMU',
		firefighters: 'Bomberos',
		comingSoon: 'Pronto: transporte público y consejos de seguridad, con fuentes oficiales.'
	},

	help: {
		title: 'Ayuda gratuita',
		lead: 'Adónde ir en São Paulo. Separamos a quien hace tu trámite de quien te orienta.',
		scamTitle: 'Cuidado con las estafas',
		scam1: 'Agendar en la Policía Federal es gratis, en el sitio oficial.',
		scam2: 'Las tasas oficiales se pagan con la guía del gobierno (GRU), generada en el sitio de la Policía Federal. Nunca pagues por Pix a una persona.',
		scam3: 'Pedir refugio siempre es gratis.',
		scam4: 'Desconfía de quien promete acelerar tu trámite.',
		processes: 'Hace el trámite',
		guides: 'Orienta',
		toConfirm: 'Información por confirmar',
		call: 'Llamar',
		email: 'Correo',
		hours: 'Horario',
		dpuTitle: 'Defensoría Pública de la Unión (DPU)',
		dpuText: 'Orientación jurídica gratuita en asuntos federales: Policía Federal y refugio. Atención en el CRAI los miércoles por la mañana, con cita.',
		dpeText: 'La Defensoría del Estado atiende otros asuntos: familia, vivienda, consumo.'
	}
};

export default es;
