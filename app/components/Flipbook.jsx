import React from 'react';
import Canvas from './Canvas';

// TODO: Expose save/load functionality to a "store"

class Flipbook extends React.Component {
    setPageNumber(page) {
        let pageNumPromise = new Promise((resolve) => {
            this.setState({
                currentPage: page
            }, () => resolve());
        });

        return pageNumPromise;
    }

    prevPage() {
        if (this.state.currentPage === 0) {
            return;
        }

        this.clearCanvas();
        this.setPageNumber(this.state.currentPage - 1).then(() => {
            this.loadCanvas(this.state.currentPage);
        });
    }

    appendEmptyPage() {
        const pagesCopy = JSON.parse(JSON.stringify(this.state.pages));

        let canvas;
        let img = new Image();

        this.cloneHTML(pagesCopy);

        this.clearCanvas();

        canvas = this.canvas.toDataURL();
        img.src = canvas;

        pagesCopy.push({ canvasImg: img });

        this.setState({
            pages: pagesCopy
        });
    }

    nextPage() {
        if (this.state.currentPage + 1 === this.state.pages.length) {
            this.saveCanvas().then(() => {
                this.appendEmptyPage();
            });
        } else {
            this.clearCanvas();
        }

        this.setPageNumber(this.state.currentPage + 1).then(() => {
            this.loadCanvas(this.state.currentPage);
        });
    }


    render() {
        return (
            <div>
                <Canvas />

                <button
                    onClick={() => this.prevPage()}
                >prev</button>

                <button
                    onClick={() => this.nextPage()}
                >next</button>
            </div>
        );
    }
}

export default Flipbook;
