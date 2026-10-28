// Interface text in Portuguese. The official content (documents, steps) comes from the knowledge base.
const pt = {
	appName: 'Rumo',
	tagline: 'Seu passo a passo para viver no Brasil, com base em fontes oficiais.',
	disclaimer: 'App independente, sem vínculo com a Polícia Federal ou outros órgãos públicos. Não substitui orientação jurídica.',
	privacy: 'Suas respostas ficam só no seu celular.',
	languageTitle: 'Escolha seu idioma',
	languageLabel: 'Idioma',
	contentInPortuguese: '',
	start: 'Começar',
	continue: 'Continuar',
	back: 'Voltar',
	edit: 'Editar',
	loading: 'Carregando…',
	stepOf: 'Passo {n} de {total}',
	offlineReady: 'Funciona sem internet depois da primeira visita.',

	country: {
		title: 'De qual país você é?',
		lead: 'Sua nacionalidade define quais caminhos existem para você.',
		search: 'Buscar país',
		searchPlaceholder: 'Digite o nome do país',
		popular: 'Mais escolhidos',
		results: 'Resultados',
		noResults: 'Nenhum país encontrado.',
		showAll: 'Ver todos os países',
		groups: {
			Mercosul: 'Mercosul',
			'Fronteiriço sem acordo Mercosul': 'Fronteiriço',
			'Acolhida humanitária': 'Acolhida humanitária',
			CPLP: 'CPLP',
			'Caso específico': 'Caso específico'
		} as Record<string, string>
	},

	situation: {
		title: 'Sua situação agora',
		whereTitle: 'Onde você está?',
		inBrazil: 'No Brasil',
		abroad: 'No exterior',
		city: 'Cidade',
		cityName: 'São Paulo – SP',
		cityNote: 'Por enquanto o Rumo cobre a cidade de São Paulo.',
		cpfTitle: 'Você já tem CPF?',
		cpfYes: 'Sim',
		cpfNo: 'Não',
		cpfUnknown: 'Não sei o que é',
		cpfInfoTitle: 'O que é o CPF?',
		cpfAdded: 'Vamos colocar o CPF no seu caminho.',
		docTitle: 'Qual documento brasileiro você já tem?',
		docs: {
			none: 'Nenhum ainda',
			protocol: 'Protocolo de refúgio',
			dprnm: 'DPRNM (documento provisório)',
			crnm: 'CRNM (carteira de registro)',
			visa: 'Visto temporário',
			dou: 'Autorização publicada no Diário Oficial',
			unknown: 'Não sei'
		}
	},

	goals: {
		title: 'O que você precisa agora?',
		lead: 'Pode marcar mais de um.',
		live: 'Morar legalmente no Brasil',
		liveHint: 'Autorização de residência na Polícia Federal',
		family: 'Trazer ou juntar-me a um familiar',
		familyHint: 'Reunião familiar',
		refuge: 'Pedir proteção (refúgio)',
		refugeHint: 'Se você teme voltar ao seu país. É gratuito e tem regras próprias.',
		address: 'Mudar meu endereço no registro',
		addressHint: 'Online e gratuito, na Polícia Federal',
		seeSummary: 'Ver meu resumo'
	},

	summary: {
		title: 'Confira seu perfil',
		nationality: 'Nacionalidade',
		situation: 'Onde está · documento · CPF',
		goals: 'O que precisa',
		noCpf: 'sem CPF',
		hasCpf: 'com CPF',
		pathTitle: 'Caminhos para você',
		build: 'Montar meu caminho',
		notOfficial: 'Orientação baseada em fontes oficiais. Não é decisão do governo.',
		addedNoCpf: 'Adicionado porque você ainda não tem CPF'
	},

	path: {
		title: 'Meu caminho',
		profileLine: 'Perfil: {country} · {city}',
		progress: '{done} de {total} etapas prontas',
		empty: 'Responda algumas perguntas para montar seu caminho.',
		startTriage: 'Começar',
		open: 'Ver o que levar',
		docsReady: '{done} de {total} documentos prontos',
		redo: 'Refazer perguntas'
	},

	notices: {
		abroad: 'Fora do Brasil, o pedido começa no consulado brasileiro. O Rumo ainda não cobre esse caminho.',
		'has-crnm': 'Você já tem a CRNM. Se ela estiver perto de vencer, procure o CRAI para saber o próximo passo.',
		'own-modality': 'Sua nacionalidade tem uma modalidade própria na Polícia Federal ({modalities}). O Rumo ainda não detalha esse caminho: fale com o CRAI.',
		'no-specific-modality': 'Não encontramos uma modalidade de residência específica para sua nacionalidade. Veja se reunião familiar ou refúgio se aplicam a você, ou fale com o CRAI.',
		'nothing-selected': 'Você não marcou nenhum objetivo. Volte e escolha o que precisa.',
		talkToCrai: 'Falar com o CRAI'
	},

	reasons: {
		'no-cpf': 'Adicionado porque você ainda não tem CPF',
		residence: 'Para sua nacionalidade',
		registration: 'Porque você já tem visto ou autorização publicada',
		family: 'Você pediu reunião familiar',
		refuge: 'Você pediu refúgio',
		'refuge-document': 'Documento para quem pede refúgio',
		address: 'Você pediu para mudar o endereço'
	} as Record<string, string>,

	procedures: {
		'P-CPF': 'Tirar o CPF',
		'P-RES-VEN': 'Autorização de residência (Venezuela, Guiana, Suriname)',
		'P-RES-MERCOSUL': 'Autorização de residência pelo Acordo Mercosul',
		'P-RES-REUNIAO': 'Reunião familiar',
		'P-REG-CRNM': 'Registro e carteira (CRNM)',
		'P-REFUGIO': 'Pedir refúgio',
		'P-DPRNM': 'Documento provisório (DPRNM)',
		'P-ENDERECO': 'Atualizar endereço no registro',
		'P-COMPROVANTE': 'Comprovante de residência'
	} as Record<string, string>,

	procedure: {
		whoCanApply: 'Quem pode pedir',
		where: 'Onde pedir',
		cost: 'Custo',
		timing: 'Prazos',
		legalBasis: 'Base legal',
		whatIsIt: 'O que é e por que preciso?',
		documents: 'O que levar',
		steps: 'Passo a passo',
		markReady: 'Marcar como pronto',
		ready: 'Pronto',
		howToGet: 'Como conseguir',
		alternatives: 'Alternativas aceitas',
		formalities: 'Tradução e apostila',
		condition: 'Quando é pedido',
		unconfirmedHelp: 'Não conseguimos confirmar este item em fonte oficial. Confirme no canal oficial antes de ir.',
		officialChannel: 'Canal oficial',
		sources: 'Fontes',
		verifiedAt: 'Verificado em {date}',
		restricted: 'página exigia login na verificação',
		secondary: 'fonte não oficial',
		backToPath: 'Voltar ao meu caminho',
		stage: 'Quando apresentar'
	},

	status: {
		required: 'Obrigatório',
		conditional: 'Condicional',
		unconfirmed: 'A confirmar',
		not_required: 'Não exigido'
	} as Record<string, string>,

	nav: { path: 'Meu caminho', city: 'Cidade', help: 'Ajuda' },

	city: {
		title: 'Guia da cidade',
		healthTitle: 'Saúde: para onde ir?',
		susRight: 'Imigrantes têm acesso aos serviços públicos de saúde, sem discriminação por nacionalidade ou situação migratória.',
		susSource: 'Lei de Migração (Lei 13.445/2017), art. 4º, VIII',
		ubs: 'Posto de saúde (UBS)',
		ubsText: 'Consultas, vacinas e Cartão SUS. Para o dia a dia.',
		upa: 'UPA 24h',
		upaText: 'Urgência: febre alta, cortes, dor forte. Aberta 24 horas.',
		hospital: 'Pronto-socorro',
		hospitalText: 'Emergência grave: falta de ar, dor no peito, acidente.',
		generalGuidance: 'Orientação geral; em caso de dúvida, ligue 192.',
		emergencyTitle: 'Emergência',
		police: 'Polícia',
		ambulance: 'SAMU',
		firefighters: 'Bombeiros',
		comingSoon: 'Em breve: transporte público e dicas de segurança, com fontes oficiais.'
	},

	help: {
		title: 'Ajuda gratuita',
		lead: 'Onde ir em São Paulo. Separamos quem faz o seu pedido de quem orienta.',
		scamTitle: 'Cuidado com golpes',
		scam1: 'Agendar na Polícia Federal é gratuito, pelo site oficial.',
		scam2: 'Taxas oficiais são pagas pela guia do governo (GRU), gerada no site da Polícia Federal. Nunca pague por Pix a uma pessoa.',
		scam3: 'Pedir refúgio é sempre gratuito.',
		scam4: 'Desconfie de quem promete acelerar o seu processo.',
		processes: 'Faz o pedido',
		guides: 'Orienta',
		toConfirm: 'Informação a confirmar',
		call: 'Ligar',
		email: 'E-mail',
		hours: 'Horário',
		dpuTitle: 'Defensoria Pública da União (DPU)',
		dpuText: 'Orientação jurídica gratuita em assuntos federais: Polícia Federal e refúgio. Plantão no CRAI às quartas de manhã, com agendamento.',
		dpeText: 'A Defensoria do Estado atende outros assuntos: família, moradia, consumo.'
	}
};

export default pt;
export type Messages = typeof pt;
