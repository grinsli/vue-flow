import { computed, inject, ref } from 'vue'
import type { CustomEvent, ElementData } from '../types'
import { ErrorCode, VueFlowError, getConnectedEdges } from '../utils'
import { NodeRef } from '../context'
import { useVueFlow } from './useVueFlow'
import { useNodeId } from './useNodeId'

/**
 * Access a node, it's parent (if one exists) and connected edges
 *
 * If no node id is provided, the node id is injected from context
 *
 * Meaning if you do not provide an id, this composable has to be called in a child of your custom node component, or it will throw
 */
export function useNode<Data = ElementData, CustomEvents extends Record<string, CustomEvent> = any>(id?: string) {
  const nodeId = id ?? useNodeId() ?? ''
  const nodeEl = inject(NodeRef, ref(null))

  const { findNode, edges, emits } = useVueFlow()

  const node = findNode<Data, CustomEvents>(nodeId)!

  if (!node) {
    emits.error(new VueFlowError(ErrorCode.NODE_NOT_FOUND, nodeId))
  }

  return {
    id: nodeId,
    nodeEl,
    node,
    parentNode: computed(() => findNode(node.parentNode)),
    connectedEdges: computed(() => getConnectedEdges([node], edges.value)),
  }
}
