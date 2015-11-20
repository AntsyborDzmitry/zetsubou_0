import ewf from 'ewf';

ewf.service('paginationService', PaginationService);

export default function PaginationService() {
    this.paginate = paginate;

    /**
     * `paginate` function paginates argument data according to `pageIndex` and `pageSize` arguments.
     *
     * According to business requirements, there are several use-cases that are related to pagination.
     * A typical pagination consists of the following use-cases:
     * 1. `In-the-middle` pagination view:
     *
     *      [1] [...] [x - 1] [x] [x + 1] [...] [n]
     *                -------------------
     *                  the middle part
     *
     * 1.1. For the `In-the-middle` view a currently selected page is always page [x] (the center page)
     *
     * 2. Left-aligned pagination view:
     *
     *      [1] [2] [3] [4] [...] [n]
     *
     * 3. Right-aligned pagination view:
     *
     *      [1] [...] [n - 3] [n - 2] [n - 1] [n]
     *
     * 4. Trimmed view (when the amount of pages is less than the amount of pages which displayed in
     * pagination, i.e. 5 by default)
     *
     *      [1] [2] [3] [4] [5]
     *
     * 5. Special case: when there is 1 page to show, be careful in order not to show [1] [1]
     * ------------------------------------------------------------------------------------------------
     *
     * In order to deal with the business requirement a `paginationWindow` variable is used, it is an array
     * of objects with the following interface:
     *
     *      {
     *          index: `an index of the page`,
     *          display: `the value used for display`
     *      }
     */
    function paginate(
            data,
            pageIndex = 0,
            pageSize = 0,
            leftButtonsCount = 1,
            rightButtonsCount = 1,
            middleButtonsCount = 3
        ) {

        const middleButtonsHalf = Math.floor(middleButtonsCount / 2);

        if (data && data.length && pageSize > 0) {
            const pageCount = Math.floor(data.length / pageSize) + (data.length % pageSize === 0 ? 0 : 1);
            const paginationPageIndex = (pageIndex < pageCount) ? pageIndex : pageCount - 1;
            const rowMin = pageSize * paginationPageIndex + 1;
            const rowMax = Math.min(data.length, pageSize * (paginationPageIndex + 1));

            const paginationWindow = [];
            const paginationData = pageCount > 0 ? data.slice(rowMin - 1, rowMax) : [];

            addLeftSide(
                paginationWindow,
                leftButtonsCount < paginationPageIndex - middleButtonsHalf,
                Math.min(pageCount, leftButtonsCount)
            );

            // Middle buttons
            const middleMed = Math.max(paginationPageIndex - middleButtonsHalf, leftButtonsCount);
            const middleMax = Math.min(middleMed + middleButtonsCount, pageCount - rightButtonsCount);
            const middleMin = Math.max(middleMax - middleButtonsCount, leftButtonsCount);

            for (let i = middleMin; i < middleMax; i++) {
                paginationWindow.push({
                    index: i,
                    display: i + 1
                }); // Add middle buttons
            }

            addRightSide(
                paginationWindow,
                middleMax < pageCount - rightButtonsCount,
                middleMax < pageCount && pageCount > 1,
                pageCount
            );

            return {
                pageSize: pageSize || 0,

                rowMin,
                rowMax,

                pageIndex: paginationPageIndex,
                pageCount,

                data: paginationData,
                window: paginationWindow
            };
        }

        return generateDefaultSettings(pageSize);
    }

    function generateDefaultSettings(pageSize) {
        return {
            pageSize: pageSize || 0,

            rowMin: 0,
            rowMax: 0,

            pageIndex: 0,
            pageCount: 0,

            data: [],
            // even when there is nothing to display first page is displayed
            window: [{
                index: 0,
                display: 1
            }]
        };
    }

    function addLeftSide(paginationWindow, shouldAddEllipsis, buttonsCount) {
        for (let i = 0; i < buttonsCount; i++) {
            paginationWindow.push({
                index: i,
                display: i + 1
            });
        }

        if (shouldAddEllipsis) {
            paginationWindow.push({
                index: null,
                display: '...'
            });
        }
    }

    function addRightSide(paginationWindow, shouldAddEllipsis, shouldAddRightButtons, pageCount) {
        if (shouldAddEllipsis) {
            paginationWindow.push({
                index: null,
                display: '...'
            });
        }

        if (shouldAddRightButtons) {
            paginationWindow.push({
                index: pageCount - 1,
                display: pageCount
            });
        }
    }
}
