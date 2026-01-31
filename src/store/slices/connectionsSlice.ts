import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ActiveConnection, ConnectionStatus } from '../../services/websocket';

interface ConnectionsState {
  activeConnections: ActiveConnection[];
  wsStatus: ConnectionStatus;
  lastUpdate: number | null;
}

const initialState: ConnectionsState = {
  activeConnections: [],
  wsStatus: 'disconnected',
  lastUpdate: null,
};

const connectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    addConnection: (state, action: PayloadAction<ActiveConnection>) => {
      const exists = state.activeConnections.some(
        (conn) => conn.id === action.payload.id
      );
      console.log(`[Redux] addConnection - id: ${action.payload.id}, exists: ${exists}, total: ${state.activeConnections.length + 1}`);
      if (!exists) {
        state.activeConnections.push(action.payload);
        state.lastUpdate = Date.now();
      }
    },
    removeConnection: (state, action: PayloadAction<string>) => {
      const sizeBefore = state.activeConnections.length;
      state.activeConnections = state.activeConnections.filter(
        (conn) => conn.id !== action.payload
      );
      console.log(`[Redux] removeConnection - id: ${action.payload}, before: ${sizeBefore}, after: ${state.activeConnections.length}`);
      state.lastUpdate = Date.now();
    },
    updateConnection: (state, action: PayloadAction<ActiveConnection>) => {
      const index = state.activeConnections.findIndex(
        (conn) => conn.id === action.payload.id
      );
      if (index !== -1) {
        state.activeConnections[index] = action.payload;
        state.lastUpdate = Date.now();
      }
    },
    setWSStatus: (state, action: PayloadAction<ConnectionStatus>) => {
      state.wsStatus = action.payload;
    },
    clearConnections: (state) => {
      state.activeConnections = [];
      state.lastUpdate = Date.now();
    },
    setActiveConnections: (state, action: PayloadAction<ActiveConnection[]>) => {
      state.activeConnections = action.payload;
      state.lastUpdate = Date.now();
    },
  },
});

export const {
  addConnection,
  removeConnection,
  updateConnection,
  setWSStatus,
  clearConnections,
  setActiveConnections,
} = connectionsSlice.actions;

export default connectionsSlice.reducer;
