import { defineStore } from "pinia";

export const useCollateralVerificationsTokenStore = defineStore(
  "collateralVerificationsTokenStore",
  {
    state: (): {
      tokenData: CollateralVerificationTokens | null;
      loadingTokens: boolean;
      errorLoadingTokens: string | null;
    } => {
      return {
        tokenData: null,
        loadingTokens: false,
        errorLoadingTokens: null,
      };
    },
    getters: {
      getTokenBalance(state) {
        return state.tokenData?.balance || 0;
      },
    },
    actions: {
      async loadTokenData(forceRefresh = false) {
        const { get } = useStandardizedApi();
        try {
          this.loadingTokens = true;
          const response = await get<
            GenericCollateralVerificationResponse<CollateralVerificationTokens>
          >("/api/col-v/load-tokens");
          if (response.success) {
            const data: CollateralVerificationTokens = (
              response as StandardSuccessResponse<
                GenericCollateralVerificationResponse<CollateralVerificationTokens>
              >
            ).data.data;
            this.tokenData = data;
          }
        } catch (ex) {
          this.loadingTokens = false;
        }
      },
    },
  },
);
