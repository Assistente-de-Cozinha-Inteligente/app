import * as Haptics from "expo-haptics";

/**
 * Helper centralizado de Haptics
 *
 * Regra geral:
 * - NÃO usar em todo clique
 * - Usar apenas quando há significado na ação
 */
export const haptics = {
  /**
   * Seleção leve
   * Usar quando algo muda de estado, mas não é uma ação final.
   *
   * Exemplos:
   * - Toggle on/off
   * - Checkbox
   * - Favoritar
   * - Seleção em lista
   */
  select() {
    return Haptics.selectionAsync();
  },

  /**
   * Confirmação leve
   * Usar quando o usuário executa uma ação simples, mas válida.
   *
   * Exemplos:
   * - Botão "OK"
   * - Aplicar filtro
   * - Confirmar escolha
   */
  light() {
    return Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );
  },

  /**
   * Ação clara e intencional
   * Usar quando algo realmente acontece.
   *
   * Exemplos:
   * - Salvar dados
   * - Enviar formulário
   * - Adicionar ao carrinho
   */
  medium() {
    return Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Medium
    );
  },

  /**
   * Ação importante ou decisiva
   * Usar com MUITA moderação.
   *
   * Exemplos:
   * - Finalizar pedido
   * - Concluir cadastro
   * - Ação principal do app
   */
  heavy() {
    return Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Heavy
    );
  },

  /**
   * Sucesso
   * Usar quando algo deu certo e o usuário precisa dessa confirmação.
   *
   * Exemplos:
   * - Login bem-sucedido
   * - Pedido enviado
   * - Dados salvos com sucesso
   */
  success() {
    return Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );
  },

  /**
   * Erro
   * Usar quando uma ação falhou ou é inválida.
   *
   * Exemplos:
   * - Senha errada
   * - Campo inválido
   * - Ação bloqueada
   */
  error() {
    return Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Error
    );
  },

  /**
   * Alerta / aviso
   * Usar para ações potencialmente destrutivas.
   *
   * Exemplos:
   * - Excluir item
   * - Cancelar ação irreversível
   */
  warning() {
    return Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Warning
    );
  },
};
