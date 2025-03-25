import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumCardSkeletonComponent } from './album-card-skeleton.component';

describe('AlbumCardSkeletonComponent', () => {
    let component: AlbumCardSkeletonComponent;
    let fixture: ComponentFixture<AlbumCardSkeletonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AlbumCardSkeletonComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AlbumCardSkeletonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
