import {AlbumCollectionPaginationProvider} from '../../../src/album/AlbumCollectionPaginationProvider';
import {AlbumCollectionProvider} from '../../../src/album/AlbumCollectionProvider';
import {expect} from '../../util/expect';
import {aPaginationSet} from '../pagination/PaginationSetBuilder';
import {aPaginationSetItem as aPage} from '../pagination/SimplePaginationSetItemBuilder';
import {PaginationSetProvider} from '../../../src/pagination/PaginationSetProvider';
import {when, mock, instance} from 'ts-mockito';

describe('AlbumCollectionPaginationProvider (real logic)', () => {
    let albumCollectionProvider:AlbumCollectionProvider;
    let albumCollectionPaginationProvider:AlbumCollectionPaginationProvider;

    beforeEach(() => {
        albumCollectionProvider = mock(AlbumCollectionProvider);
        albumCollectionPaginationProvider = new AlbumCollectionPaginationProvider(
            instance(albumCollectionProvider),
            new PaginationSetProvider()
        );
    });

    describe('providing pagination items of albums collection', () => {
        it('returns correct list of available results pages', () => {
            // given
            when(albumCollectionProvider.getCurrentPage()).thenReturn(6);
            when(albumCollectionProvider.getTotalCount()).thenReturn(10);
            const expectedItems = aPaginationSet()
                .withFirst(aPage(1))
                .withLast(aPage(10))
                .withNext(aPage(7))
                .withPrevious(aPage(5))
                .withAdjacentPages([
                    aPage(4),
                    aPage(5),
                    aPage(6, true),
                    aPage(7),
                    aPage(8),
                ]).build();

            // when
            const result = albumCollectionPaginationProvider.getPaginationItems();

            // then
            expect(result).to.deep.equal(expectedItems);
        });
    });
});

describe('AlbumCollectionPaginationProvider (mocked logic)', () => {
    let albumCollectionProvider:AlbumCollectionProvider;
    let albumCollectionPaginationProvider:AlbumCollectionPaginationProvider;
    let paginationSetProvider:PaginationSetProvider;

    beforeEach(() => {
        albumCollectionProvider = mock(AlbumCollectionProvider);
        paginationSetProvider = mock(PaginationSetProvider);
        albumCollectionPaginationProvider = new AlbumCollectionPaginationProvider(
            instance(albumCollectionProvider),
            instance(paginationSetProvider)
        );
    });

    describe('providing pagination items of albums collection', () => {
        it('returns correct list of available results pages', () => {
            // given
            const expectedItems = aPaginationSet().build();
            const currentPage = 6;
            const pageCount = 10;
            when(albumCollectionProvider.getCurrentPage()).thenReturn(currentPage);
            when(albumCollectionProvider.getTotalCount()).thenReturn(pageCount);
            when(paginationSetProvider.getPaginationSet(currentPage, pageCount)).thenReturn(expectedItems);

            // when
            const result = albumCollectionPaginationProvider.getPaginationItems();

            // then
            expect(result).to.equal(expectedItems);
        });
    });
});
