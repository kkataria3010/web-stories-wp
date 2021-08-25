/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { fireEvent, waitFor, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { SavedTemplatesContent, SavedTemplatesHeader } from '..';
import { renderWithProviders } from '../../../../testUtils';
import formattedTemplatesArray from '../../../../dataUtils/formattedTemplatesArray';
import {
  STORY_SORT_OPTIONS,
  VIEW_STYLE,
  SAVED_TEMPLATES_STATUSES,
} from '../../../../constants';
import LayoutProvider from '../../../../components/layout/provider';

jest.mock('@web-stories-wp/story-editor', () => ({
  __esModule: true,
  ...jest.requireActual('@web-stories-wp/story-editor'),
  PreviewPage: ({ page }) => <div data-testid={page.name} />, // eslint-disable-line react/prop-types,react/display-name
}));
jest.mock(
  '../../../../app/font/fontProvider.js',
  () =>
    ({ children }) =>
      children
);

// TODO https://github.com/google/web-stories-wp/issues/8746
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('<SavedTemplates />', function () {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call the set sort function when a new sort is selected', async function () {
    const setSortFn = jest.fn();
    renderWithProviders(
      <LayoutProvider>
        <SavedTemplatesHeader
          filter={{ value: SAVED_TEMPLATES_STATUSES.ALL }}
          templates={formattedTemplatesArray}
          search={{ keyword: '', setKeyword: jest.fn() }}
          sort={{ value: STORY_SORT_OPTIONS.CREATED_BY, set: setSortFn }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300, containerHeight: 300 },
          }}
        />
      </LayoutProvider>,
      { features: { enableInProgressStoryActions: false } }
    );
    fireEvent.click(screen.getByLabelText('Choose sort option for display'));
    fireEvent.click(screen.getByText('Date Created'));

    await waitFor(() => {
      expect(setSortFn).toHaveBeenCalledWith('date');
    });
  });

  it('should render the content grid with the correct saved template count.', function () {
    renderWithProviders(
      <LayoutProvider>
        <SavedTemplatesContent
          templates={formattedTemplatesArray}
          page={{
            requestNextPage: jest.fn(),
          }}
          view={{
            style: VIEW_STYLE.GRID,
            pageSize: { width: 200, height: 300, containerHeight: 300 },
          }}
        />
      </LayoutProvider>,
      { features: { enableInProgressStoryActions: false } }
    );

    expect(screen.getAllByText('See details')).toHaveLength(
      formattedTemplatesArray.length
    );
  });
});
