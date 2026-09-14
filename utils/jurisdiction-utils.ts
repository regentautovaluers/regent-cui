/**
 * What money a job is in.
 *
 * Mirrored from `accident-backend/app/core/vocabularies.py`, which mirrors the
 * estate's own `ValuationCountryEnum {KE, UG, RW}` in valuation-spring. Four
 * codebases now hold this table -- the service, the back-office portal, the
 * field app and this console -- and the reason it is copied rather than
 * fetched is that it is not administered: nobody at Regent gets to decide that
 * Rwanda pays in francs, so there is nothing to configure and nothing to keep
 * in sync at runtime.
 *
 * All three are zero-decimal in trade, which is why every figure crossing the
 * wire is a whole unit.
 */

export type Jurisdiction = 'KE' | 'UG' | 'RW';

export const CURRENCY_BY_JURISDICTION: Record<Jurisdiction, string> = {
	KE: 'KES',
	UG: 'UGX',
	RW: 'RWF',
};

/** The estate's own, and what a record with no jurisdiction is shown in. */
export const DEFAULT_CURRENCY = CURRENCY_BY_JURISDICTION.KE;

/**
 * The currency a claim is priced in.
 *
 * An unrecognised jurisdiction answers Kenya's rather than throwing, the same
 * fallback the service makes: a claims table that will not render because one
 * row carries an unexpected country code is a worse failure than one labelled
 * with the estate's currency and visibly wrong to whoever reads it.
 */
export function currencyOf(jurisdiction?: string | null): string {
	if (!jurisdiction) return DEFAULT_CURRENCY;
	return CURRENCY_BY_JURISDICTION[jurisdiction as Jurisdiction] ?? DEFAULT_CURRENCY;
}
