import { Colors } from '@/constants/theme';
import { Inventario } from '@/models';
import { getUnidadePrincipalPorCategoria } from '@/utils/unidadesHelper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { TextUI } from './ui/text';

type CardItemInventarioProps = {
  item: Inventario;
  onItemPress?: (item: Inventario) => void;
  onItemRemove?: (ingrediente_id: number) => void;
  onItemSearch?: (item: Inventario) => void;
};

export function CardItemInventario({
  item,
  onItemPress,
  onItemRemove,
  onItemSearch,
}: CardItemInventarioProps) {
  // Usa a unidade do item, ou fallback para a unidade principal baseada na categoria
  const unidade = item.unidade || (item.ingrediente?.categoria
    ? getUnidadePrincipalPorCategoria(item.ingrediente.categoria)
    : 'unidade');

  // Calcula dias até a validade (só se tiver validade cadastrada)
  const temValidade = item.validade !== null && item.validade !== undefined;
  let validadeInfo: { texto: string; cor: string; bgColor: string } | null = null;

  if (temValidade) {
    const agora = Date.now();
    const diasRestantes = Math.ceil((item.validade! - agora) / (1000 * 60 * 60 * 24));
    const estaVencido = diasRestantes < 0;
    const venceHoje = diasRestantes === 0;
    const venceEm3Dias = diasRestantes > 0 && diasRestantes <= 3;

    // Cor e texto baseado na validade
    if (estaVencido) {
      validadeInfo = {
        texto: `Vencido há ${Math.abs(diasRestantes)} ${Math.abs(diasRestantes) === 1 ? 'dia' : 'dias'}`,
        cor: Colors.light.danger,
        bgColor: `${Colors.light.danger}15`,
      };
    } else if (venceHoje) {
      validadeInfo = {
        texto: 'Vence hoje',
        cor: Colors.light.danger,
        bgColor: `${Colors.light.danger}15`,
      };
    } else if (venceEm3Dias) {
      validadeInfo = {
        texto: `Vence em ${diasRestantes} ${diasRestantes === 1 ? 'dia' : 'dias'}`,
        cor: '#FF9800',
        bgColor: '#FFF3E0',
      };
    } else {
      validadeInfo = {
        texto: `Vence em ${diasRestantes} ${diasRestantes === 1 ? 'dia' : 'dias'}`,
        cor: Colors.light.bodyText,
        bgColor: Colors.light.input,
      };
    }
  }

  const handlePress = () => {
    onItemPress?.(item);
  };

  const handleRemove = () => {
    onItemRemove?.(item.ingrediente_id);
  };

  const handleSearch = () => {
    onItemSearch?.(item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Lado esquerdo: Nome, quantidade/unidade e validade */}
        <TouchableOpacity
          onPress={handlePress}
          style={styles.leftContent}
          activeOpacity={0.7}
        >
          <TextUI variant="regular" style={styles.itemNome}>
            {item.ingrediente?.nome || 'Item'}
          </TextUI>
          <View style={styles.infoRow}>
            <TextUI variant="regular" style={styles.itemQuantidade}>
              {item.quantidade} {item.quantidade === 1 ? unidade : `${unidade}s`}
            </TextUI>
            {validadeInfo && (
              <View style={[styles.validadeBadge, { backgroundColor: validadeInfo.bgColor }]}>
                <TextUI variant="regular" style={[styles.validadeText, { color: validadeInfo.cor }]}>
                  {validadeInfo.texto}
                </TextUI>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Lado direito: Ícone de busca e deletar */}
        <View style={styles.rightContent}>
          <TouchableOpacity
            onPress={handleSearch}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons name="search-outline" size={18} color={Colors.light.bodyText} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRemove}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color={Colors.light.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.white,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  leftContent: {
    flex: 1,
    marginRight: 8,
  },
  itemNome: {
    fontSize: 14,
    color: Colors.light.mainText,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  itemQuantidade: {
    fontSize: 12,
    color: Colors.light.bodyText,
  },
  validadeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  validadeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },
});

