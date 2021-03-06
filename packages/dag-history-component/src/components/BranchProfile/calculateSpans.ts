import { initialSpans, insertSpan, Span } from '../../util/spans'

const isNumber = (d: number) => !isNaN(d) && d !== null
const convertArg = (arg: number | undefined, offset: number) =>
	arg !== null && arg !== undefined ? arg - offset : arg

export default function calculateSpans(
	type: string,
	max: number,
	startArg: number,
	endArg: number,
	branchStartArg: number,
	branchEndArg: number,
	activeIndexArg: number,
) {
	const offset = startArg
	const start = startArg - offset
	const end = endArg - offset
	const branchStart = branchStartArg - offset
	const branchEnd = branchEndArg - offset
	const activeIndex = convertArg(activeIndexArg, offset)

	// Set up the initial spans ranges; culling out empty ranges
	let spans = initialSpans(start, max)
	const isCurrent = type === 'current'
	spans = insertSpan(spans, new Span(start, end + 1, 'UNRELATED_UNIQUE'))

	if (
		isNumber(branchStart) &&
		isNumber(branchEnd) &&
		branchStart >= 0 &&
		branchEnd >= 0
	) {
		const color = isCurrent ? 'CURRENT' : 'ANCESTOR'
		const span = new Span(branchStart, branchEnd + 1, color)
		spans = insertSpan(spans, span)
	}

	if (isNumber(activeIndex)) {
		const color = isCurrent ? 'CURRENT_ACTIVE' : 'LEGACY_ACTIVE'
		const span = new Span(activeIndex, activeIndex + 1, color)
		spans = insertSpan(spans, span)
	}

	return spans
}
