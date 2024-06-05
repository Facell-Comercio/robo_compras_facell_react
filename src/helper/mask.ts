import { format } from "date-fns"

export const normalizeNumberOnly = (value: string | undefined) => {
    if (!value) return ''
    return value.replace(/[\D]/g, '')
}

export const normalizePhoneNumber = (value: string | undefined) => {
    if (!value) return ''

    return value.replace(/[\D]/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})(\d+?)/, '$1')
}

export const normalizeCnpjNumber = (value: string | undefined) => {
    if (!value) return ''
    const pureValue = value.replace(/[\D]/g, '')
    if (pureValue.length <= 11) {
        return pureValue
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1')
    }
    return pureValue
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1')
}

export const normalizeCepNumber = (value: string | undefined) => {
    if (!value) return ''
    return value.replace(/\D/g, "")
        .replace(/^(\d{5})(\d{3})/, "$1-$2")
        .replace(/(-\d{3})(\d+?)/, '$1')
        .substring(0, 9)
}

export const normalizePercentual = (value: string | undefined) => {
    if (!value) return '0.00%'
    const valueMultiplicado = parseFloat(value)
    if(isNaN(valueMultiplicado)){
        return '0.00%'
    }
    return valueMultiplicado.toLocaleString("pt-BR", { style: "percent", minimumFractionDigits: 2 });
}

export const normalizeDataDayOne = (dataString?: string) => {
    if(dataString){
        const data = new Date(dataString);
    
        const ano = data.getFullYear();
        const mes = (data.getMonth() + 1).toString().padStart(2, '0');
        
        const dataFormatada = `${ano}-${mes}-01`;
        
        return dataFormatada;
    }
}

export const normalizeDate = (data: string|Date) => data && format(data, "dd/MM/yyyy");
export const normalizeCurrency = (data: string|number) => {
    if(typeof data === "string"){
        const valor = parseFloat(data)
        if(!valor)
            return "R$ 0,00"
        return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
    }else{
        return data.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

    }
}

export const normalizeFirstAndLastName = (nomeCompleto: string) => {
    if(!nomeCompleto) return 'NOME NÃO INFORMADO!'
    // Usa uma expressão regular para extrair o primeiro e último nome
    const match = nomeCompleto.match(/^(\S+)\s+(.+)\s+(\S+)$/);
        
    // Verifica se houve uma correspondência
    if (match) {
      const primeiroNome = match[1];
      const ultimoNome = match[3];
      return `${primeiroNome} ${ultimoNome}`;
    } else {
      // Se não houver correspondência, assume que o nome completo é o primeiro nome
      return `${nomeCompleto}`;
    }
  }

  export const normalizeMes=(mes: string|number) =>{
    const arrayMes = [
        "Janeiro" ,
        "Fevereiro" ,
        "Março" ,
        "Abril" ,
        "Maio" ,
        "Junho" ,
        "Julho" ,
        "Agosto" ,
        "Setembro" ,
        "Outubro" ,
        "Novembro" ,
        "Dezembro" ,
      ];
    if(mes ){
        return arrayMes[+mes-1].toLocaleLowerCase()
    }
  }

  export const sliceString = (texto:string, maxWidth:number) => {
    if (texto.length > maxWidth) {
        const ultimaPosicaoEspaco = texto.lastIndexOf(' ', maxWidth);
        const textoCortado = ultimaPosicaoEspaco === -1 ? texto.slice(0, maxWidth) : texto.slice(0, ultimaPosicaoEspaco);
        return textoCortado + '...';
    } else {
        return texto;
    }
}